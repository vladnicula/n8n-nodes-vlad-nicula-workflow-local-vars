import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export const localVarScope: Record<string, Record<string, any>> = {}

export class WorkflowVariablesNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Workflow Variables Node',
		name: 'workflowVariablesNode',
		group: ['transform'],
		version: 2,
		description: 'Access Workflow Instance Variables',
		defaults: {
			name: 'Workflow Variables',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Set',
						value: 'set',
					},
					{
						name: 'Get',
						value: 'get',
					},
				],
				default: 'get', // The initially selected option
			},
			{
				displayName: 'Content (JSON)',
				name: 'content',
				type: 'json',
				default: '',
			}
		],
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let item: INodeExecutionData;
		let operation: string
		let jsonInsturctionObject: Record<string, unknown>;

		// Iterates over all input items and add the key "myString" with the
		// value the parameter "myString" resolves to.
		// (This could be a different value for each item in case it contains an expression)
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				jsonInsturctionObject = JSON.parse(this.getNodeParameter('content', itemIndex, '') as string);
				operation = this.getNodeParameter('operation', itemIndex, '') as string;

				const debugInfo: Record<string, unknown> = {
					getInstanceId: this.getInstanceId(),
					getExecutionId: this.getExecutionId(),
					operation,
					localVarScopeSize: Object.keys(localVarScope).length
				}

				// debugInfo[operation] = jsonInsturctionObject

				const localExecutionVarScope = localVarScope[this.getExecutionId()] ??= {}

				if ( operation === 'set' ) {
					Object.assign(localExecutionVarScope, jsonInsturctionObject)
					debugInfo.set = localVarScope
				} else {
					const getResult: Record<string, unknown> = {}
					Object.keys(jsonInsturctionObject).forEach(key => {
						getResult[key] = localExecutionVarScope[key]
					})
					debugInfo.get = getResult
				}

				item = items[itemIndex];
				item.json.debug = debugInfo
			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [items];
	}
}
