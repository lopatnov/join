/**
 * Join Types
 */
export declare enum JoinTypes {
    none = 0,
    left = 8,
    right = 1,
    innerLeft = 4,
    innerRight = 2,
    innerJoin = 6,
    leftJoin = 14,
    rightJoin = 7,
    fullJoin = 15,
    expand = 11
}
export declare function join(joinType?: JoinTypes): <TContext>(context: TContext) => <TJoinObject>(joinObject: TJoinObject) => TContext & TJoinObject;
