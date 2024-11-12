import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class TemplateStringNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Template String Node',
		name: 'templateStringNode',
		group: ['transform'],
		version: 2,
		description: 'Allows you to manipulate a multi line text message for usage in later nodes.',
		defaults: {
			name: 'Template String Node',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		const itemsWithDescription = items.map((item) => {
			return { json: { description: item.json.description } }
		})

		return [itemsWithDescription]
	}
}
