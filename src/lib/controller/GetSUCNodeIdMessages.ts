import type { IDriver } from "../driver/IDriver";
import { FunctionType, MessagePriority, MessageType } from "../message/Constants";
import { expectedResponse, Message, MessageDeserializationOptions, messageTypes, priority } from "../message/Message";
import type { JSONObject } from "../util/misc";

@messageTypes(MessageType.Request, FunctionType.GetSUCNodeId)
@expectedResponse(FunctionType.GetSUCNodeId)
@priority(MessagePriority.Controller)
export class GetSUCNodeIdRequest extends Message { }

@messageTypes(MessageType.Response, FunctionType.GetSUCNodeId)
export class GetSUCNodeIdResponse extends Message {
	public constructor(
		driver: IDriver,
		options: MessageDeserializationOptions,
	) {
		super(driver, options);
		this._sucNodeId = this.payload[0];
	}

	private _sucNodeId: number;
	/** The node id of the SUC or 0 if none is present */
	public get sucNodeId(): number {
		return this._sucNodeId;
	}

	public toJSON(): JSONObject {
		return super.toJSONInherited({
			sucNodeId: this.sucNodeId,
		});
	}
}
