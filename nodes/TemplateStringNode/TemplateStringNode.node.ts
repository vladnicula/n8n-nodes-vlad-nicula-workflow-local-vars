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
		version: 3,
		description: 'Allows you to manipulate a multi line text message for usage in later nodes.',
		defaults: {
			name: 'Template String Node',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				default: 'multi line text here',
				required: true,
				typeOptions: {
					rows: 16,
				}
			}
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		const itemsContent = items.map((item) => {
			return { json: { content: item.json.content } }
		})

		return [itemsContent]
	}
}
