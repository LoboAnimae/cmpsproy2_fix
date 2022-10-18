import { MinusContext } from 'antlr/yaplParser';
import { IMemoryVisitor, MemoryVisitor } from 'Implementations/4_Intermediate/visitor';
import { IntType } from 'Implementations/Generics';
import { basicOperation } from '../Instructions';
import { Sub } from '../Instructions/Operation';

export default function (visitor: MemoryVisitor, ctx: MinusContext): IMemoryVisitor[] {
  const [leftChildTemporal, rightChildTemporal, temporal] = basicOperation(visitor, ctx);
  visitor.addQuadruple(
    new Sub({
      saveIn: temporal,
      operand1: leftChildTemporal,
      operand2: rightChildTemporal,
    }),
  );
  const size = IntType.Size;
  const getTemporal = () => temporal;
  return [{ size, getTemporal }];
}
