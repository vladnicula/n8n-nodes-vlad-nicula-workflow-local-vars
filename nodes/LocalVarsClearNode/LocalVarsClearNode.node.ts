import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { localVarScope } from '../WorkflowVariablesNode/WorkflowVariablesNode.node';

export class LocalVarsClearNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Local Vars Clear Node',
		name: 'localVarsClearNode',
		group: ['transform'],
		version: 3,
		description: 'Basic Local Vars Clear Node',
		defaults: {
			name: 'Local Vars Clear Node',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [],
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const executionid = this.getExecutionId();
		delete localVarScope[executionid]
		return [items];
	}
}
