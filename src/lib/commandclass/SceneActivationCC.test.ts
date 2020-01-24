import { createEmptyMockDriver } from "../../../test/mocks";
import type { IDriver } from "../driver/IDriver";
import { Duration } from "../values/Duration";
import { CommandClasses } from "./CommandClasses";
import { SceneActivationCC, SceneActivationCCSet, SceneActivationCommand } from "./SceneActivationCC";

const fakeDriver = (createEmptyMockDriver() as unknown) as IDriver;

function buildCCBuffer(nodeId: number, payload: Buffer): Buffer {
	return Buffer.concat([
		Buffer.from([
			nodeId, // node number
			payload.length + 1, // remaining length
			CommandClasses["Scene Activation"], // CC
		]),
		payload,
	]);
}

describe("lib/commandclass/SceneActivationCC => ", () => {
	it("the Set command (without Duration) should serialize correctly", () => {
		const cc = new SceneActivationCCSet(fakeDriver, {
			nodeId: 2,
			sceneId: 55,
		});
		const expected = buildCCBuffer(
			2,
			Buffer.from([
				SceneActivationCommand.Set, // CC Command
				55, // id
				0xff, // default duration
			]),
		);
		expect(cc.serialize()).toEqual(expected);
	});

	it("the Set command (with Duration) should serialize correctly", () => {
		const cc = new SceneActivationCCSet(fakeDriver, {
			nodeId: 2,
			sceneId: 56,
			dimmingDuration: new Duration(1, "minutes"),
		});
		const expected = buildCCBuffer(
			2,
			Buffer.from([
				SceneActivationCommand.Set, // CC Command
				56, // id
				0x80, // 1 minute
			]),
		);
		expect(cc.serialize()).toEqual(expected);
	});

	it("the Set command should be deserialized correctly", () => {
		const ccData = buildCCBuffer(
			1,
			Buffer.from([
				SceneActivationCommand.Set, // CC Command
				15, // id
				0x00, // 0 seconds
			]),
		);
		const cc = new SceneActivationCCSet(fakeDriver, { data: ccData });

		expect(cc.sceneId).toBe(15);
		expect(cc.dimmingDuration).toEqual(new Duration(0, "seconds"));
	});

	it("deserializing an unsupported command should return an unspecified version of SceneActivationCC", () => {
		const serializedCC = buildCCBuffer(
			1,
			Buffer.from([255]), // not a valid command
		);
		const cc: any = new SceneActivationCC(fakeDriver, {
			data: serializedCC,
		});
		expect(cc.constructor).toBe(SceneActivationCC);
	});

	// it("the CC values should have the correct metadata", () => {
	// 	// Readonly, 0-99
	// 	const currentValueMeta = getCCValueMetadata(
	// 		CommandClasses["Scene Activation"],
	// 		"currentValue",
	// 	);
	// 	expect(currentValueMeta).toMatchObject({
	// 		readable: true,
	// 		writeable: false,
	// 		min: 0,
	// 		max: 99,
	// 	});

	// 	// Writeable, 0-99
	// 	const targetValueMeta = getCCValueMetadata(
	// 		CommandClasses["Scene Activation"],
	// 		"targetValue",
	// 	);
	// 	expect(targetValueMeta).toMatchObject({
	// 		readable: true,
	// 		writeable: true,
	// 		min: 0,
	// 		max: 99,
	// 	});
	// });
});
