import { LessEqualContext } from 'antlr/yaplParser';
import { TemporalValue } from 'Components/TemporaryValues';
import { IMemoryVisitor, MemoryVisitor } from 'Implementations/4_Intermediate/visitor';
import { BoolType } from 'Implementations/Generics';
import { LESSEQUAL } from '../Instructions/Comparison';

export default function (visitor: MemoryVisitor, ctx: LessEqualContext): IMemoryVisitor[] {
  const [leftExpression, rightExpression] = ctx.expression();
  const [left] = visitor.visit(leftExpression);
  const [right] = visitor.visit(rightExpression);
  const temporal = new TemporalValue();

  visitor.addQuadruple(
    new LESSEQUAL({
      fistOperand: left.getTemporal(),
      secondOperand: right.getTemporal(),
      goTo: temporal.toString(),
    }),
  );

  return [{ size: BoolType.Size, getTemporal: () => temporal }];
}
