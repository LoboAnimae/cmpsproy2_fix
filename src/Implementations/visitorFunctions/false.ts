import { FalseContext } from '../../antlr/yaplParser';
import ValueComponent from '../Components/ValueHolder';
import BoolType from '../Generics/Boolean.type';
import { YaplVisitor } from './meta';

export default function visitFalse(_visitor: YaplVisitor, _ctx: FalseContext) {
  const newBool = new BoolType();
  const boolValue = new ValueComponent({ value: 0 });
  newBool.addComponent(boolValue);
  /*
  Why does this component not have a quadrupleElement representation, you ask?
    1. It holds no memory representation.
    2. It can be hardcoded.
    3. It is a terminal node that holds no variable value, such as Integers and Strings
   */
  return newBool;
}
