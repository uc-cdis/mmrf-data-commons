export const CancerDistributionCNVMockData = {
  data: {
    cases: {
      amplification: {
        project: {
          project_id: {
            histogram: [
              { key: 'Project A', count: 15 },
              { key: 'Project B', count: 10 },
              { key: 'Project C', count: 5 },
            ],
          },
        },
      },
      gain: {
        project: {
          project_id: {
            histogram: [
              { key: 'Project A', count: 20 },
              { key: 'Project B', count: 12 },
              { key: 'Project D', count: 8 },
            ],
          },
        },
      },
      loss: {
        project: {
          project_id: {
            histogram: [
              { key: 'Project C', count: 7 },
              { key: 'Project D', count: 9 },
              { key: 'Project E', count: 3 },
            ],
          },
        },
      },
      homozygousDeletion: {
        project: {
          project_id: {
            histogram: [
              { key: 'Project B', count: 4 },
              { key: 'Project E', count: 6 },
              { key: 'Project F', count: 2 },
            ],
          },
        },
      },
      cnvTotal: {
        project: {
          project_id: {
            histogram: [
              { key: 'Project A', count: 35 },
              { key: 'Project B', count: 32 },
              { key: 'Project C', count: 12 },
              { key: 'Project D', count: 17 },
              { key: 'Project E', count: 9 },
              { key: 'Project F', count: 2 },
            ],
          },
        },
      },
      cnvCases: {
        _totalCount: 6,
      },
    },
  },
};
