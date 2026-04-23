import { Title, Description, Primary, Controls, Stories } from "@storybook/addon-docs/blocks";
import { ComponentMeta, type ComponentMetaProps } from "./ComponentMeta";

/**
 * Build a Storybook custom docs page for a component.
 * Pass the component's metadata (status, figma, changelog, etc.)
 * and assign the returned component to parameters.docs.page:
 *
 *   parameters: {
 *     docs: {
 *       page: fabricDocsPage({ status: "alpha", version: "0.1.0", ... }),
 *     },
 *   }
 */
export function fabricDocsPage(meta: ComponentMetaProps) {
  return function FabricDocsPage() {
    return (
      <>
        <Title />
        <Description />
        <Primary />
        <Controls />
        <Stories />
        <ComponentMeta {...meta} />
      </>
    );
  };
}
