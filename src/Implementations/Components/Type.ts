import ComponentInformation from './ComponentInformation';
import Composition from './Composition';
import { DownUpHierarchy } from './Hierarchy';

export interface TypeParams {
  isGeneric?: boolean;
  sizeInBytes: number;
  parent: TypeComponent | null;
}

export interface TypeInstance {
  isAncestorOf: (_incomingType?: Composition) => boolean;
  hasAsAncestor: (_incomingType?: Composition) => boolean;
  allowsAssignmentOf: (_incomingType?: Composition) => boolean;
  allowsComparisonTo: (_incomingType?: Composition) => boolean;
  coherseType: (_incomingType?: Composition, value?: any) => any;
  createChild: () => TypeComponent;
}

export function extractTypeComponent(inComponent?: Composition | null) {
  if (!inComponent) return null;
  const { Type } = ComponentInformation.components;
  return inComponent.getComponent<TypeComponent>({ componentType: Type.type });
}

/**
 * A type component is a component that describes a type. It is the main component of a type system.
 */
export abstract class TypeComponent extends Composition implements DownUpHierarchy<TypeComponent> {
  readonly componentType = ComponentInformation.components.Type.type;
  isGeneric?: boolean;
  sizeInBytes?: number;
  parent: TypeComponent | null;
  allowsNegation: boolean;
  defaultValue: any;

  constructor(options?: Partial<TypeParams> & Partial<TypeInstance>) {
    super();
    const { Type } = ComponentInformation.components;
    this.componentName = Type.name;
    this.isGeneric = options?.isGeneric ?? false;
    this.sizeInBytes = options?.sizeInBytes;
    this.parent = options?.parent ?? null;
    this.allowsNegation = false;
    this.defaultValue = null;
  }

  readonly getHierarchy = (): TypeComponent[] => {
    return [...(this.parent?.getHierarchy() ?? []), this];
  };

  readonly isAncestorOf = (incomingType?: Composition) => {
    const typeComponent = incomingType?.getComponent<TypeComponent>(
      { componentType: incomingType?.componentType },
      { currentScope: true },
    );
    if (!typeComponent) return false;
    return typeComponent.hasAsAncestor(this);
  };

  readonly hasAsAncestor = (incomingType?: Composition) => {
    const hierarchyChainNames = this.getHierarchy()
      .map((t) => t.componentName)
      .filter((t) => t !== this.componentName);

    // Don't grab only in the current scope because inherited types are allowed
    const incomingTypeComponent = incomingType?.getComponent<TypeComponent>({
      componentType: ComponentInformation.components.Type.type,
    })?.componentName;

    return hierarchyChainNames.includes(incomingTypeComponent ?? '');
  };

  abstract allowsAssignmentOf: (_incomingType?: Composition) => boolean;
  abstract allowsComparisonTo: (_incomingType?: Composition) => boolean;
  abstract coherseType: (_incomingType?: Composition, value?: any) => any;
  abstract createChild: () => TypeComponent;
}

export interface TypeSupport {
  components: { type: TypeComponent };
}

export default TypeComponent;
