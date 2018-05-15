import numpy as np

def preprocess(data, exclude=[], impute=0.75):
    """ Perform the imputation and exclude particularly offensive states
    """
    clean_results = []
    for state, results in data.items():
        if state in exclude: continue
        clean_results += [impute if r == 1.0 else 1 - impute if r == 0 else r for r in results['results']]

    return clean_results

def seats_votes_curve(all_results, n_sims=100000, n_districts=10):
    """ Build it """

    # More efficient to convert everything to numpy
    all_results = np.asarray(all_results)

    # Pull random sets of districts and record voteshare and seats for each
    delegation = np.random.choice(all_results, (n_districts, n_sims))

    # voteshare % and seats won for each simulated election
    voteshare = np.sum(delegation, axis=0) / n_districts
    seatshare = np.sum(delegation > 0.5, axis=0) / n_districts

    return seatshare, voteshare

def bin_stats(seatshare, voteshare):
    bins = np.arange(-0.0005, 1.0005, 0.001)

    stats = []

    for lo, hi in zip(bins[:-1], bins[1:]):
        b = seatshare[np.logical_and(voteshare >= lo, voteshare < hi)]
        m, s = np.mean(b), np.std(b)

        stats.append({'mean': None if np.isnan(m) else m, 'std': None if np.isnan(s) else s})

    return stats

if __name__ == '__main__':
    import json
    from collections import defaultdict
    with open('precomputed_tests.json') as file:
        allresults = json.load(file)

    seats_votes = {}
    stats = defaultdict(dict)

    skip = {
        '2012': ['PA', 'NC', 'OH', 'MI', 'IN'],
        '2014': ['PA', 'NC', 'MI'],
        '2016': ['PA', 'NC', 'OH', 'MI', 'IN', 'FL', 'VA']
    }

    for y in skip:
        for ndists in range(6, 21):
            res = allresults[y]
            seatshare, voteshare = seats_votes_curve(preprocess(res, exclude=skip[y]), n_districts=ndists)
            # seats_votes[y] = [{'x': x, 'y': y} for x,y in zip(voteshare, seatshare)]
            stats[str(ndists)][y] = bin_stats(seatshare, voteshare)

    # with open('seatsvotes.json', 'w') as file:
    #     json.dump(seats_votes, file)

    with open('sv_stats.json', 'w') as file:
        json.dump(stats, file)
