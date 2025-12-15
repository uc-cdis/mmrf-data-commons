
export interface S2SetOperation {
  S1_intersect_S2: Array<string>;
  S1_minus_S2: Array<string>;
  S2_minus_S1: Array<string>;
}

export interface S3SetOperation {
  S1_intersect_S2_intersect_S3: Array<string>;
  S1_intersect_S2_minus_S3: Array<string>;
  S2_intersect_S3_minus_S1: Array<string>;
  S1_intersect_S3_minus_S2: Array<string>;
}


export function computeS2SetValues(
  C1: ReadonlyArray<string>,
  C2: ReadonlyArray<string>,
): S2SetOperation {
  const S1 = new Set<string>(C1);
  const S2 = new Set<string>(C2);
  const S1_intersect_S2 = [...S1.intersection(S2)];
  const S1_minus_S2 = [...S1.difference(S2)];
  const S2_minus_S1 = [...S2.difference(S1)];

  return {
    S1_intersect_S2,
    S1_minus_S2,
    S2_minus_S1,
  };
}

export function computeS3SetValues(
  C1: ReadonlyArray<string>,
  C2: ReadonlyArray<string>,
  C3: ReadonlyArray<string>,
): S3SetOperation {
  const S1 = new Set<string>(C1);
  const S2 = new Set<string>(C2);
  const S3 = new Set<string>(C3);
  const S1_intersect_S2_intersect_S3 = [
    ...S1.intersection(S2).intersection(S3),
  ];
  const S1_intersect_S2_minus_S3 = [...S1.intersection(S2).difference(S3)];
  const S2_intersect_S3_minus_S1 = [...S2.intersection(S3).difference(S1)];
  const S1_intersect_S3_minus_S2 = [...S1.intersection(S3).difference(S2)];

  return {
    S1_intersect_S2_intersect_S3,
    S1_intersect_S2_minus_S3,
    S2_intersect_S3_minus_S1,
    S1_intersect_S3_minus_S2,
  };
}
