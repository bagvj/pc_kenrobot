define(function() {
	var schema = {
		hardware: {
			boards: [{
				label: "Arduino UNO",
				name: "ArduinoUNO",
				type: "uno",
				tags: ["Arduino"],
				pins: [{
					uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad01",
					width: 9,
					height: 12,
					x: 0.479,
					y: 0.088,
					name: "13",
					tags: ["digital"],
					overlay: [0.5, 1.5]
				}, {
					uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad02",
					width: 9,
					height: 12,
					x: 0.513,
					y: 0.088,
					name: "12",
					tags: ["digital"],
					overlay: [0.5, 1.5]
				}, {
					uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad03",
					width: 9,
					height: 12,
					x: 0.547,
					y: 0.088,
					name: "11",
					tags: ["digital", "analog-out"],
					overlay: [0.5, 1.5]
				}, {
					uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad04",
					width: 9,
					height: 12,
					x: 0.581,
					y: 0.088,
					name: "10",
					tags: ["digital", "analog-out"],
					overlay: [0.5, 1.5]
				}, {
					uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad05",
					width: 9,
					height: 12,
					x: 0.615,
					y: 0.088,
					name: "9",
					tags: ["digital", "analog-out"],
					overlay: [0.5, 1.5]
				}, {
					uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad06",
					width: 9,
					height: 12,
					x: 0.649,
					y: 0.088,
					name: "8",
					tags: ["digital"],
					overlay: [0.5, 1.5]
				}, {
					uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad07",
					width: 9,
					height: 12,
					x: 0.704,
					y: 0.088,
					name: "7",
					tags: ["digital"],
					overlay: [0.5, 1.5]
				}, {
					uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad08",
					width: 9,
					height: 12,
					x: 0.738,
					y: 0.088,
					name: "6",
					tags: ["digital", "analog-out"],
					overlay: [0.5, 1.5]
				}, {
					uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad09",
					width: 9,
					height: 12,
					x: 0.772,
					y: 0.088,
					name: "5",
					tags: ["digital", "analog-out"],
					overlay: [0.5, 1.5]
				}, {
					uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad10",
					width: 9,
					height: 12,
					x: 0.804,
					y: 0.088,
					name: "4",
					tags: ["digital"],
					overlay: [0.5, 1.5]
				}, {
					uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad11",
					width: 9,
					height: 12,
					x: 0.838,
					y: 0.088,
					name: "3",
					tags: ["digital", "analog-out", "init"],
					overlay: [0.5, 1.5]
				}, {
					uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad12",
					width: 9,
					height: 12,
					x: 0.872,
					y: 0.088,
					name: "2",
					tags: ["digital", "init"],
					overlay: [0.5, 1.5]
				}, {
					uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad13",
					width: 9,
					height: 12,
					x: 0.906,
					y: 0.088,
					name: "1",
					tags: ["digital", "serial-rx"],
					overlay: [0.5, 1.5]
				}, {
					uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad13",
					width: 9,
					height: 12,
					x: 0.94,
					y: 0.088,
					name: "0",
					tags: ["digital", "serial-tx"],
					overlay: [0.5, 1.5]
				}, {
					uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa00",
					width: 9,
					height: 12,
					x: 0.77,
					y: 0.935,
					name: "A0",
					tags: ["analog-in"],
					overlay: [0.5, -0.5]
				}, {
					uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa01",
					width: 9,
					height: 12,
					x: 0.804,
					y: 0.935,
					name: "A1",
					tags: ["analog-in"],
					overlay: [0.5, -0.5]
				}, {
					uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa02",
					width: 9,
					height: 12,
					x: 0.838,
					y: 0.935,
					name: "A2",
					tags: ["analog-in"],
					overlay: [0.5, -0.5]
				}, {
					uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa03",
					width: 9,
					height: 12,
					x: 0.872,
					y: 0.935,
					name: "A3",
					tags: ["analog-in"],
					overlay: [0.5, -0.5]
				}, {
					uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa04",
					width: 9,
					height: 12,
					x: 0.906,
					y: 0.935,
					name: "A4",
					tags: ["analog-in"],
					overlay: [0.5, -0.5]
				}, {
					uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa05",
					width: 9,
					height: 12,
					x: 0.94,
					y: 0.935,
					name: "A5",
					tags: ["analog-in"],
					overlay: [0.5, -0.5]
				}, {
					width: 32,
					height: 62,
					x: 0.045,
					y: 0.321,
					name: "Serial",
					tags: ["serial"],
					uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ac05",
					overlay: [0.5, 1.5]
				}]
			}, {
				label: "Arduino Leonardo",
				name: "ArduinoLeonardo",
				type: "leonardo",
				tags: ["Arduino"],
				pins: [{
					uid: "a721ef13-1547-421d-9bd9-c8712c738374",
					width: 9,
					height: 12,
					x: 0.432,
					y: 0.049,
					name: "13",
					tags: ["digital", "analog-out"],
					overlay: [0.5, 1.5]
				}, {
					uid: "91023fb9-f685-49d7-8bc6-7e0948b7aa51",
					width: 9,
					height: 12,
					x: 0.469,
					y: 0.049,
					name: "12",
					tags: ["digital"],
					overlay: [0.5, 1.5]
				}, {
					uid: "6c8ddf11-5881-4857-9a67-07dc457b7be7",
					width: 9,
					height: 12,
					x: 0.506,
					y: 0.049,
					name: "11",
					tags: ["digital", "analog-out"],
					overlay: [0.5, 1.5]
				}, {
					uid: "b2c9954e-08aa-42fe-b7d4-7f6c4015c23f",
					width: 9,
					height: 12,
					x: 0.542,
					y: 0.049,
					name: "10",
					tags: ["digital", "analog-out"],
					overlay: [0.5, 1.5]
				}, {
					uid: "1f77b4ea-f800-411b-a50c-6f557c611d84",
					width: 9,
					height: 12,
					x: 0.579,
					y: 0.049,
					name: "9",
					tags: ["digital", "analog-out"],
					overlay: [0.5, 1.5]
				}, {
					uid: "94b87092-bcaf-4ed3-a951-5ee2ad72c139",
					width: 9,
					height: 12,
					x: 0.615,
					y: 0.049,
					name: "8",
					tags: ["digital"],
					overlay: [0.5, 1.5]
				}, {
					uid: "92fe4ade-6ca4-4453-9065-a9e4e9ca8812",
					width: 9,
					height: 12,
					x: 0.669,
					y: 0.049,
					name: "7",
					tags: ["digital"],
					overlay: [0.5, 1.5]
				}, {
					uid: "d63c3675-9a3e-4f85-a8cd-dc0abf3d4d03",
					width: 9,
					height: 12,
					x: 0.706,
					y: 0.049,
					name: "6",
					tags: ["digital", "analog-out"],
					overlay: [0.5, 1.5]
				}, {
					uid: "1bf02f17-40eb-4751-a16d-f763a108da89",
					width: 9,
					height: 12,
					x: 0.742,
					y: 0.049,
					name: "5",
					tags: ["digital", "analog-out"],
					overlay: [0.5, 1.5]
				}, {
					uid: "6824abb1-c01a-400d-b9dd-53947f320caf",
					width: 9,
					height: 12,
					x: 0.779,
					y: 0.049,
					name: "4",
					tags: ["digital"],
					overlay: [0.5, 1.5]
				}, {
					uid: "f23bd365-6896-4565-a832-d05cc577b854",
					width: 9,
					height: 12,
					x: 0.815,
					y: 0.049,
					name: "3",
					tags: ["digital", "analog-out", "init"],
					overlay: [0.5, 1.5]
				}, {
					uid: "bd9cea8a-e117-4c73-ade5-5f9c416af152",
					width: 9,
					height: 12,
					x: 0.852,
					y: 0.049,
					name: "2",
					tags: ["digital", "init"],
					overlay: [0.5, 1.5]
				}, {
					uid: "a9a2a902-b78a-4367-b009-8a43ebca6a23",
					width: 9,
					height: 12,
					x: 0.889,
					y: 0.049,
					name: "1",
					tags: ["digital", "serial-rx", "init"],
					overlay: [0.5, 1.5]
				}, {
					uid: "db088a27-0101-4c23-8c17-97414fe344fe",
					width: 9,
					height: 12,
					x: 0.925,
					y: 0.049,
					name: "0",
					tags: ["digital", "serial-tx", "init"],
					overlay: [0.5, 1.5]
				}, {
					uid: "82c2817b-6652-4c67-9788-41d9f789c95e",
					width: 9,
					height: 12,
					x: 0.742,
					y: 0.953,
					name: "A0",
					tags: ["analog-in"],
					overlay: [0.5, -0.5]
				}, {
					uid: "79f573fe-452f-4beb-b7e8-13a3f010e0c3",
					width: 9,
					height: 12,
					x: 0.779,
					y: 0.953,
					name: "A1",
					tags: ["analog-in"],
					overlay: [0.5, -0.5]
				}, {
					uid: "19c7d61e-0d2c-4bd7-afac-1058bc5f31d3",
					width: 9,
					height: 12,
					x: 0.815,
					y: 0.953,
					name: "A2",
					tags: ["analog-in"],
					overlay: [0.5, -0.5]
				}, {
					uid: "be694e9e-c6f6-4a9f-b8c3-a33062b9f86a",
					width: 9,
					height: 12,
					x: 0.852,
					y: 0.953,
					name: "A3",
					tags: ["analog-in"],
					overlay: [0.5, -0.5]
				}, {
					uid: "cef2d1f0-bd2c-4dfa-8861-e35160e59670",
					width: 9,
					height: 12,
					x: 0.889,
					y: 0.953,
					name: "A4",
					tags: ["analog-in"],
					overlay: [0.5, -0.5]
				}, {
					uid: "8a98203b-dd68-41dc-b915-84f345a2c200",
					width: 9,
					height: 12,
					x: 0.925,
					y: 0.953,
					name: "A5",
					tags: ["analog-in"],
					overlay: [0.5, -0.5]
				}]
			}, {
				label: "Arduino/Genuino 101",
				name: "Arduino101",
				type: "genuino101",
				tags: ["Arduino"],
				pins: [{
					uid: "ab7cd85a-9abe-48c4-a8bc-a22eb5578995",
					width: 9,
					height: 12,
					x: 0.475,
					y: 0.07,
					name: "13",
					tags: ["digital", "init"],
					overlay: [0.5, 1.5]
				}, {
					uid: "d83f0b0d-11c5-45fe-8d91-a728dc9152f6",
					width: 9,
					height: 12,
					x: 0.506,
					y: 0.07,
					name: "12",
					tags: ["digital", "init"],
					overlay: [0.5, 1.5]
				}, {
					uid: "b23995cd-9283-4153-9247-3f2d99c5c577",
					width: 9,
					height: 12,
					x: 0.537,
					y: 0.07,
					name: "11",
					tags: ["digital", "init"],
					overlay: [0.5, 1.5]
				}, {
					uid: "08f5be15-9437-4fea-b641-960297a9256d",
					width: 9,
					height: 12,
					x: 0.568,
					y: 0.07,
					name: "10",
					tags: ["digital", "init"],
					overlay: [0.5, 1.5]
				}, {
					uid: "5b9d5525-f336-48a1-9bea-05bf97e2e15a",
					width: 9,
					height: 12,
					x: 0.599,
					y: 0.07,
					name: "9",
					tags: ["digital", "analog-out", "init"],
					overlay: [0.5, 1.5]
				}, {
					uid: "e0ddd32c-0b2e-40de-83d3-5a1a9495cabd",
					width: 9,
					height: 12,
					x: 0.63,
					y: 0.07,
					name: "8",
					tags: ["digital", "init"],
					overlay: [0.5, 1.5]
				}, {
					uid: "0cad225d-c342-47de-a330-24ef08502843",
					width: 9,
					height: 12,
					x: 0.697,
					y: 0.07,
					name: "7",
					tags: ["digital", "init"],
					overlay: [0.5, 1.5]
				}, {
					uid: "9f398c7d-0b85-4692-bffe-28e6129e1ece",
					width: 9,
					height: 12,
					x: 0.728,
					y: 0.07,
					name: "6",
					tags: ["digital", "analog-out", "init"],
					overlay: [0.5, 1.5]
				}, {
					uid: "65ec63cb-ed89-49a4-8244-f1b90c435144",
					width: 9,
					height: 12,
					x: 0.759,
					y: 0.07,
					name: "5",
					tags: ["digital", "analog-out", "init"],
					overlay: [0.5, 1.5]
				}, {
					uid: "ce53f383-f875-4267-b46a-562e046960b7",
					width: 9,
					height: 12,
					x: 0.79,
					y: 0.07,
					name: "4",
					tags: ["digital", "init"],
					overlay: [0.5, 1.5]
				}, {
					uid: "50c69484-c163-44f3-841e-b6c45ca72bab",
					width: 9,
					height: 12,
					x: 0.832,
					y: 0.07,
					name: "3",
					tags: ["digital", "analog-out", "init"],
					overlay: [0.5, 1.5]
				}, {
					uid: "32be564f-f9d4-45ba-beaa-705507da4e2a",
					width: 9,
					height: 12,
					x: 0.864,
					y: 0.07,
					name: "2",
					tags: ["digital", "init"],
					overlay: [0.5, 1.5]
				}, {
					uid: "c2064580-c984-4a8d-9f06-12f25b0392e0",
					width: 9,
					height: 12,
					x: 0.894,
					y: 0.07,
					name: "1",
					tags: ["digital", "serial-rx", "init"],
					overlay: [0.5, 1.5]
				}, {
					uid: "79bda001-83ca-4bbc-90c4-a850c1ea2a08",
					width: 9,
					height: 12,
					x: 0.925,
					y: 0.07,
					name: "0",
					tags: ["digital", "serial-tx", "init"],
					overlay: [0.5, 1.5]
				}, {
					uid: "e817da0e-74c0-4514-86a9-df8580424048",
					width: 9,
					height: 12,
					x: 0.770,
					y: 0.935,
					name: "A0",
					tags: ["analog-in", "init"],
					overlay: [0.5, -0.5]
				}, {
					uid: "2b7dc051-c089-433e-b137-5fbc805410d7",
					width: 9,
					height: 12,
					x: 0.804,
					y: 0.935,
					name: "A1",
					tags: ["analog-in", "init"],
					overlay: [0.5, -0.5]
				}, {
					uid: "083d705a-1cb4-47de-b845-f90b44cc3213",
					width: 9,
					height: 12,
					x: 0.838,
					y: 0.935,
					name: "A2",
					tags: ["analog-in", "init"],
					overlay: [0.5, -0.5]
				}, {
					uid: "0b974abf-92c8-42dd-8344-f06761fc5e3d",
					width: 9,
					height: 12,
					x: 0.872,
					y: 0.935,
					name: "A3",
					tags: ["analog-in", "init"],
					overlay: [0.5, -0.5]
				}, {
					uid: "39df0dce-50a1-4358-b488-76c6aef65514",
					width: 9,
					height: 12,
					x: 0.906,
					y: 0.935,
					name: "A4",
					tags: ["analog-in", "init"],
					overlay: [0.5, -0.5]
				}, {
					uid: "5b7f72ce-3bee-4a78-bb97-bd01ba778492",
					width: 9,
					height: 12,
					x: 0.940,
					y: 0.935,
					name: "A5",
					tags: ["analog-in", "init"],
					overlay: [0.5, -0.5]
				}, {
					width: 32,
					height: 60,
					x: 0.040,
					y: 0.296,
					name: "Serial",
					tags: ["serial"],
					uid: "5b07ef5c-861f-404b-b118-b59e5eceb90c",
					overlay: [0.5, 1.5]
				}]
			}, {
				label: "KenBlock",
				name: "KenBlock",
				type: "uno",
				tags: ["KenBlock"],
				pins: [{
					uid: "c9168884-b454-4342-b677-f06dacb0b3cc",
					width: 32,
					height: 20,
					x: 0.333,
					y: 0.851,
					name: "2",
					tags: ["digital"],
					overlay: [0.5, -0.5]
				}, {
					uid: "55798942-05de-4d9c-82e8-ddced2259aec",
					width: 32,
					height: 20,
					x: 0.431,
					y: 0.851,
					name: "3",
					tags: ["digital", "analog-out"],
					overlay: [0.5, -0.5]
				}, {
					uid: "c297515b-2a2d-4b5c-96a8-e740d83a75ce",
					width: 32,
					height: 20,
					x: 0.529,
					y: 0.851,
					name: "8",
					tags: ["digital"],
					overlay: [0.5, -0.5]
				}, {
					uid: "86624d9f-0ddb-4356-8664-0afc9223e12e",
					width: 32,
					height: 20,
					x: 0.627,
					y: 0.851,
					name: "9",
					tags: ["digital", "analog-out"],
					overlay: [0.5, -0.5]
				}, {
					uid: "e29d477e-8923-40c2-8922-af988a78811f",
					width: 32,
					height: 20,
					x: 0.725,
					y: 0.851,
					name: "10",
					tags: ["digital", "analog-out"],
					overlay: [0.5, -0.5]
				}, {
					uid: "08001087-da26-451b-b124-5c100d928201",
					width: 32,
					height: 20,
					x: 0.823,
					y: 0.851,
					name: "11",
					tags: ["digital", "analog-out"],
					overlay: [0.5, -0.5]
				}, {
					width: 32,
					height: 20,
					x: 0.333,
					y: 0.149,
					name: "A0",
					tags: ["analog-in"],
					uid: "7186a1cf-2fab-4c5a-8d1e-19836d4a561d",
					overlay: [0.5, 1.5]
				}, {
					uid: "7c10ef7d-a65e-497d-868a-b9c2e43bea81",
					width: 32,
					height: 20,
					x: 0.431,
					y: 0.149,
					name: "A1",
					tags: ["analog-in"],
					overlay: [0.5, 1.5]
				}, {
					uid: "15ad5a73-f510-44bc-b4ac-5886a8211d38",
					width: 32,
					height: 20,
					x: 0.529,
					y: 0.149,
					name: "A2",
					tags: ["analog-in"],
					overlay: [0.5, 1.5]
				}, {
					uid: "129d8693-115f-40c4-a6c1-4315bd020254",
					width: 32,
					height: 20,
					x: 0.627,
					y: 0.149,
					name: "A3",
					tags: ["analog-in"],
					overlay: [0.5, 1.5]
				}, {
					uid: "d679b1cd-91d4-4aed-8f6f-6ad31d041518",
					width: 32,
					height: 20,
					x: 0.725,
					y: 0.149,
					name: "A6",
					tags: ["analog-in"],
					overlay: [0.5, 1.5]
				}, {
					uid: "15c50e12-8705-4d47-803d-5c50b7512981",
					width: 32,
					height: 20,
					x: 0.823,
					y: 0.149,
					name: "A7",
					tags: ["analog-in"],
					overlay: [0.5, 1.5]
				}, {
					uid: "ed9cbaec-e3fb-4acb-87d9-c4825bb5594c",
					width: 40,
					height: 20,
					x: 0.228,
					y: 0.851,
					name: "USART",
					tags: ["serial"],
					overlay: [0.5, -0.5]
				}, {
					uid: "e6f796e0-d283-41d3-a996-7316acb2c4cc",
					width: 40,
					height: 20,
					x: 0.228,
					y: 0.149,
					name: "IIC",
					tags: ["iic"],
					overlay: [0.5, 1.5]
				}, {
					uid: "cc94cecf-1424-4352-8309-474a814981f5",
					width: 40,
					height: 20,
					x: 0.97,
					y: 0.72,
					name: "IIC",
					tags: ["iic"],
					overlay: [0.5, 1.5],
					rotate: true
				}, {
					uid: "0ae7f137-66e0-437a-998f-c71a2ec62c3b",
					width: 20,
					height: 54,
					x: 0.97,
					y: 0.336,
					name: "MA",
					tags: ["motor"],
					overlay: [0.5, 1.5]
				}, {
					uid: "ee0399c9-2700-4456-96e1-47803c1ff60a",
					width: 20,
					height: 54,
					x: 0.97,
					y: 0.54,
					name: "MB",
					tags: ["motor"],
					overlay: [0.5, 1.5]
				}]
			}],
			components: [{
				uid: "bd3ddead-5062-4ab3-9b3d-2ba85e938d0e",
				name: "button",
				label: "按键",
				type: "button",
				category: "sensor",
				boards: ["Arduino"],
				width: 72,
				height: 72,
				pins: [{
					name: "s",
					anchor: [0.5, 1],
					tags: ["digital"]
				}],
				code: {
					var: "int {NAME} = {s};",
					setup: "pinMode({NAME}, INPUT);"
				},
				raw: true
			}, {
				uid: "18d12ce2-d24f-4bb6-ba1f-7ab3c50215df",
				name: "pot",
				label: "电位器",
				type: "pot",
				category: "sensor",
				boards: ["Arduino"],
				width: 72,
				height: 72,
				pins: [{
					name: "s",
					anchor: [0.5, 1],
					tags: ["analog-in"]
				}],
				code: {
					var: "int {NAME} = {s};",
					setup: "pinMode({NAME}, INPUT);"
				},
				raw: true
			}, {
				uid: "957b4564-ba2d-436b-9386-6c80a910fc59",
				name: "hts221",
				label: "温湿度传感器",
				type: "hts221",
				category: "sensor",
				boards: ["Arduino"],
				width: 72,
				height: 72,
				pins: [{
					name: "s",
					anchor: [0.5, 1],
					tags: ["digital"]
				}],
				code: {
					include: "#include <DHT.h>",
					var: "DHT {NAME}({s}, DHT22);",
					setup: "{NAME}.begin();"
				}
			}, {
				uid: "b75731dd-555f-4ba6-b275-e4fefb3d9c64",
				name: "encoder",
				label: "旋转编码器",
				type: "encoder",
				category: "sensor",
				boards: ["Arduino"],
				width: 72,
				height: 72,
				pins: [{
					name: "k",
					anchor: [0.25, 1],
					tags: ["digital"]
				}, {
					name: "sa",
					anchor: [0.5, 1],
					tags: ["init"],
					spec: "3"
				}, {
					name: "sb",
					anchor: [0.75, 1],
					tags: ["init"],
					spec: "2"
				}],
				code: {
					include: "#include <Encoder.h>",
					var: "Encoder {NAME}({sa}, {sb});",
					setup: "{NAME}.begin();"
				}
			}, {
				uid: "e1bde3b1-11f6-48c2-ad56-a8f0220d6e7a",
				name: "infraredSensor",
				label: "光电对管",
				type: "infraredSensor",
				category: "sensor",
				boards: ["Arduino"],
				width: 72,
				height: 72,
				pins: [{
					name: "s",
					anchor: [0.5, 1],
					tags: ["digital"]
				}],
				code: {
					var: "int {NAME} = {s};",
					setup: "pinMode({NAME}, INPUT);"
				},
				raw: true
			}, {
				uid: "2d6073e7-ecee-4699-8ccb-f1bb52c4655a",
				name: "lightSensor",
				label: "光敏传感器",
				type: "lightSensor",
				category: "sensor",
				boards: ["Arduino"],
				width: 72,
				height: 72,
				pins: [{
					name: "s",
					anchor: [0.5, 1],
					tags: ["analog-in"]
				}],
				code: {
					var: "int {NAME} = {s};",
					setup: "pinMode({NAME}, INPUT);"
				},
				raw: true
			}, {
				uid: "57307666-b6a0-4e64-b447-90732b71c4d7",
				name: "soundSensor",
				label: "声音传感器",
				type: "soundSensor",
				category: "sensor",
				boards: ["Arduino"],
				width: 72,
				height: 72,
				pins: [{
					name: "s",
					anchor: [0.5, 1],
					tags: ["digital"]
				}],
				code: {
					var: "int {NAME} = {s};",
					setup: "pinMode({NAME}, INPUT);"
				},
				raw: true
			}, {
				uid: "49c65abb-dda7-49ae-ad7e-e9aebf512869",
				name: "limitSwitch",
				label: "碰撞传感器",
				type: "limitSwitch",
				category: "sensor",
				boards: ["Arduino"],
				width: 72,
				height: 72,
				pins: [{
					name: "s",
					anchor: [0.5, 1],
					tags: ["digital"]
				}],
				code: {
					var: "int {NAME} = {s};",
					setup: "pinMode({NAME}, INPUT);"
				},
				raw: true
			}, {
				uid: "f4ef6a5f-b646-47ab-b7f3-f0dcdc6651dd",
				name: "ultrasound",
				label: "超声波",
				type: "ultrasound",
				category: "sensor",
				boards: ["Arduino"],
				width: 72,
				height: 72,
				pins: [{
					name: "tri",
					anchor: [0.333, 1],
					tags: ["digital"]
				}, {
					name: "ech",
					anchor: [0.667, 1],
					tags: ["digital"]
				}],
				code: {
					include: "#include <SR04.h>",
					var: "SR04 {NAME}({ech}, {tri});"
				}
			}, {
				uid: "aa1a2f4c-2934-414a-823f-9961fbf23c55",
				name: "led",
				label: "LED",
				type: "led",
				category: "action",
				boards: ["Arduino"],
				width: 72,
				height: 72,
				pins: [{
					name: "s",
					anchor: [0.5, 1],
					tags: ["digital"]
				}],
				code: {
					var: "int {NAME} = {s};",
					setup: "pinMode({NAME}, OUTPUT);"
				},
				raw: true
			}, {
				uid: "a8466d12-ed5e-4cc8-bffe-1031c3bb10e1",
				name: "rgb",
				label: "三色LED",
				type: "rgb",
				category: "action",
				boards: ["Arduino"],
				width: 72,
				height: 72,
				pins: [{
					name: "r",
					anchor: [0.25, 1],
					tags: ["analog-out"]
				}, {
					name: "g",
					anchor: [0.5, 1],
					tags: ["analog-out"]
				}, {
					name: "b",
					anchor: [0.75, 1],
					tags: ["analog-out"]
				}],
				code: {
					include: "#include <RGBLed.h>",
					var: "RGBLed {NAME}({r}, {g}, {b});"
				}
			}, {
				uid: "abf7ad9a-2bd9-40f4-bf83-0af03e8f4d5a",
				name: "lcd",
				label: "液晶模块",
				type: "lcd",
				category: "action",
				boards: ["Arduino"],
				width: 72,
				height: 72,
				pins: [{
					name: "sda",
					anchor: [0.33, 0],
					tags: ["analog-in"],
					spec: "A4"
				}, {
					name: "scl",
					anchor: [0.67, 0],
					tags: ["analog-in"],
					spec: "A5"
				}],
				code: {
					include: "#include <LiquidCrystal_I2C.h>",
					var: "LiquidCrystal_I2C {NAME}(0x27, 16, 2);",
					setup: "{NAME}.begin();{NAME}.clear();"
				}
			}, {
				uid: "9b26a7f3-facc-4f80-83ad-8a29f909c1d7",
				name: "buzzer",
				label: "蜂鸣器",
				type: "buzzer",
				category: "action",
				boards: ["Arduino"],
				width: 72,
				height: 72,
				pins: [{
					name: "s",
					anchor: [0.5, 1],
					tags: ["digital"]
				}],
				code: {
					var: "int {NAME} = {s};",
					setup: "pinMode({NAME}, OUTPUT);"
				}
			}, {
				uid: "a44f6a20-c35a-46dc-b495-9bcb0618c7ec",
				name: "servo",
				label: "舵机",
				type: "servo",
				category: "action",
				boards: ["Arduino"],
				width: 72,
				height: 72,
				pins: [{
					name: "s",
					anchor: [0.5, 1],
					tags: ["digital"]
				}],
				code: {
					include: "#include <Servo.h>",
					var: "Servo {NAME};",
					setup: "{NAME}.attach({s});"
				}
			}, {
				uid: "1b286953-9e06-496d-baaf-c831c0f61d87",
				name: "continuousServo",
				label: "全角度舵机",
				type: "continuousServo",
				category: "action",
				boards: ["Arduino"],
				width: 72,
				height: 72,
				pins: [{
					name: "s",
					anchor: [0.5, 1],
					tags: ["digital"]
				}],
				code: {
					include: "#include <Servo.h>",
					var: "Servo {NAME};",
					setup: "{NAME}.attach({s});"
				}
			}, {
				uid: "4b8594a2-b7ff-44fe-a8b0-319640722b30",
				name: "serial",
				label: "串口模块",
				type: "serial",
				category: "function",
				boards: ["Arduino"],
				width: 72,
				height: 72,
				pins: [{
					name: "s",
					anchor: [1, 0.5],
					tags: ["serial"],
					spec: "Serial"
				}],
				code: {
					setup: "Serial.begin(9600);"
				}
			}, {
				uid: "d4a3cc37-804e-4a07-b567-aa5ca519bc61",
				name: "bluetooth",
				label: "蓝牙模块",
				type: "serial",
				category: "function",
				boards: ["Arduino"],
				width: 72,
				height: 72,
				pins: [{
					name: "rxd",
					anchor: [0.33, 1],
					tags: ["digital", "analog-in"]
				}, {
					name: "txd",
					anchor: [0.67, 1],
					tags: ["digital", "analog-in"]
				}],
				code: {
					setup: "Serial.begin(9600);"
				}
			}, {
				uid: "c0dc58aa-2032-4c54-9fc8-3235b7e46bc1",
				name: "wifi",
				label: "wifi模块",
				type: "serial",
				category: "function",
				boards: ["Arduino"],
				width: 72,
				height: 72,
				pins: [{
					name: "rxd",
					anchor: [0.33, 1],
					tags: ["digital", "analog-in"]
				}, {
					name: "txd",
					anchor: [0.67, 1],
					tags: ["digital", "analog-in"]
				}],
				code: {
					setup: "Serial.begin(9600);"
				}
			}, {
				uid: "563eeca3-ddf2-454d-8bed-7918652da3a6",
				name: "rtc",
				label: "时钟模块",
				type: "rtc",
				category: "function",
				boards: ["Arduino"],
				width: 72,
				height: 72,
				pins: [{
					name: "sda",
					anchor: [0.333, 0],
					tags: ["analog-in"],
					spec: "A4"
				}, {
					name: "scl",
					anchor: [0.667, 0],
					tags: ["analog-in"],
					spec: "A5"
				}],
				code: {
					include: "#include <Time.h>",
					var: "tmElements_t {NAME};"
				}
			}]
		},
		software: {
			blocks: [{
				type: "group",
				name: "group",
				content: [],
				connectors: [{
					type: "connector-empty"
				}, {
					type: "connector-empty"
				}, {
					type: "connector-root",
					accept: "connector-top"
				}],
				code: "{STATEMENTS}",
				tags: []
			}, {
				type: "output",
				name: "returnSensor",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "读取"
				}, {
					id: "SENSOR",
					type: "dynamic-select",
					options: "sensors"
				}],
				code: "{SENSOR.type}",
				returnType: {
					type: "fromDynamicSelect",
					id: "SENSOR",
					options: "sensors"
				},
				tags: ["module"],
				module: "sensor"
			}, {
				type: "output",
				name: "hardwareVariable",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "返回"
				}, {
					id: "VARIABLE",
					type: "dynamic-select",
					options: "hardwareVariables"
				}],
				code: "{VARIABLE}",
				returnType: {
					type: "fromDynamicSelect",
					id: "VARIABLE",
					options: "hardwareVariables"
				},
				tags: ["module"],
				module: "hardwareVariable"
			}, {
				type: "output",
				name: "digitalRead",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "读取引脚"
				}, {
					id: "PIN",
					type: "dynamic-select",
					options: "raws"
				}, {
					type: "text",
					value: "的数字量"
				}],
				code: "digitalRead({PIN})",
				returnType: {
					type: "simple",
					value: "float"
				},
				tags: ["module"],
				module: "default"
			}, {
				type: "output",
				name: "analogRead",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "读取引脚"
				}, {
					id: "PIN",
					type: "dynamic-select",
					options: "raws"
				}, {
					type: "text",
					value: "的模拟量"
				}],
				code: "analogRead({PIN})",
				returnType: {
					type: "simple",
					value: "float"
				},
				tags: ["module"],
				module: "default"
			}, {
				type: "statement",
				name: "digitalWrite",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "bcb4ebe2-e84b-4883-bbb3-116c8c725595"
				}],
				content: [{
					type: "text",
					value: "设置引脚"
				}, {
					id: "PIN",
					type: "dynamic-select",
					options: "raws"
				}, {
					type: "text",
					value: "数字量为"
				}, {
					blockInputId: "DATA",
					type: "block-input",
					acceptType: "all",
					name: "bcb4ebe2-e84b-4883-bbb3-116c8c725595"
				}],
				code: "digitalWrite({PIN},{DATA});",
				tags: ["module"],
				module: "default"
			}, {
				type: "statement",
				name: "analogWrite",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "6200a20f-1030-4396-be04-d7f277fb8b41"
				}],
				content: [{
					type: "text",
					value: "设置引脚"
				}, {
					id: "PIN",
					type: "dynamic-select",
					options: "raws"
				}, {
					type: "text",
					value: "模拟量为"
				}, {
					blockInputId: "DATA",
					type: "block-input",
					acceptType: "all",
					name: "6200a20f-1030-4396-be04-d7f277fb8b41"
				}],
				code: "analogWrite({PIN},{DATA});",
				tags: ["module"],
				module: "default"
			}, {
				type: "output",
				name: "digitalReadAdvanced",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "c585be5f-5bdf-476d-b3c1-ebb0f8886cb8"
				}],
				content: [{
					type: "text",
					value: "读取引脚"
				}, {
					blockInputId: "PIN",
					type: "block-input",
					acceptType: "all",
					name: "c585be5f-5bdf-476d-b3c1-ebb0f8886cb8"
				}, {
					type: "text",
					value: "的数字量"
				}],
				code: "digitalRead({PIN})",
				returnType: {
					type: "simple",
					value: "float"
				},
				tags: ["module", "advanced"],
				module: "default"
			}, {
				type: "output",
				name: "analogReadAdvanced",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "8b0e7306-5424-4483-bb25-991cc88ee22c"
				}],
				content: [{
					type: "text",
					value: "读取引脚"
				}, {
					blockInputId: "PIN",
					type: "block-input",
					acceptType: "all",
					name: "8b0e7306-5424-4483-bb25-991cc88ee22c"
				}, {
					type: "text",
					value: "的模拟量"
				}],
				code: "analogRead({PIN})",
				returnType: {
					type: "simple",
					value: "float"
				},
				tags: ["module", "advanced"],
				module: "default"
			}, {
				type: "statement",
				name: "analogWriteAdvanced",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "5dbec0d7-2c71-4943-bdda-091ec3248cd7"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "786457fd-727b-4a52-ac76-ac47a96c097a"
				}],
				content: [{
					type: "text",
					value: "设置引脚"
				}, {
					blockInputId: "PIN",
					type: "block-input",
					acceptType: "all",
					name: "5dbec0d7-2c71-4943-bdda-091ec3248cd7"
				}, {
					type: "text",
					value: "模拟量为"
				}, {
					blockInputId: "DATA",
					type: "block-input",
					acceptType: "all",
					name: "786457fd-727b-4a52-ac76-ac47a96c097a"
				}],
				code: "analogWrite({PIN},{DATA});",
				tags: ["module", "advanced"],
				module: "default"
			}, {
				type: "statement",
				name: "digitalWriteAdvanced",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "06703099-aea8-4ef9-a648-a32f89051e5c"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "c68c77de-ef1c-4f54-88a3-a8566d882b7b"
				}],
				content: [{
					type: "text",
					value: "设置引脚"
				}, {
					blockInputId: "PIN",
					type: "block-input",
					acceptType: "all",
					name: "06703099-aea8-4ef9-a648-a32f89051e5c"
				}, {
					type: "text",
					value: "数字量为"
				}, {
					blockInputId: "DATA",
					type: "block-input",
					acceptType: "all",
					name: "c68c77de-ef1c-4f54-88a3-a8566d882b7b"
				}],
				code: "digitalWrite({PIN},{DATA});",
				tags: ["module", "advanced"],
				module: "default"
			}, {
				type: "output",
				name: "hts221Temperature",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "读取"
				}, {
					id: "SENSOR",
					type: "dynamic-select",
					options: "hts221s"
				}, {
					type: "text",
					value: "的温度"
				}],
				code: "{SENSOR}.readTemperature()",
				returnType: {
					type: "simple",
					value: "float"
				},
				tags: ["module"],
				module: "hts221"
			}, {
				type: "output",
				name: "hts221Humidity",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "读取"
				}, {
					id: "SENSOR",
					type: "dynamic-select",
					options: "hts221s"
				}, {
					type: "text",
					value: "的湿度"
				}],
				code: "{SENSOR}.readHumidity()",
				returnType: {
					type: "simple",
					value: "float"
				},
				tags: ["module"],
				module: "hts221"
			}, {
				type: "output",
				name: "encoderRead",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "读取旋转编码器"
				}, {
					id: "SENSOR",
					type: "dynamic-select",
					options: "encoders"
				}, {
					type: "text",
					value: "的值"
				}],
				code: "{SENSOR}.read()",
				returnType: {
					type: "simple",
					value: "int"
				},
				tags: ["module"],
				module: "encoder"
			}, {
				type: "statement",
				name: "encoderWrite",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "旋转编码器"
				}, {
					id: "SENSOR",
					type: "dynamic-select",
					options: "encoders"
				}, {
					type: "text",
					value: "写入"
				}, {
					type: "number-input",
					id: "VALUE"
				}],
				code: "{SENSOR}.write({VALUE});",
				tags: ["module"],
				module: "encoder"
			}, {
				type: "output",
				name: "ultrasoundDistance",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "超声波"
				}, {
					id: "SENSOR",
					type: "dynamic-select",
					options: "ultrasounds"
				}, {
					type: "text",
					value: "测量距离"
				}],
				code: "{SENSOR}.Distance()",
				returnType: {
					type: "simple",
					value: "long"
				},
				tags: ["module"],
				module: "ultrasound"
			}, {
				type: "output",
				name: "ultrasoundDistanceAvg",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "超声波"
				}, {
					id: "SENSOR",
					type: "dynamic-select",
					options: "ultrasounds"
				}, {
					type: "text",
					value: "测量平均距离"
				}],
				code: "{SENSOR}.DistanceAvg()",
				returnType: {
					type: "simple",
					value: "long"
				},
				tags: ["module"],
				module: "ultrasound"
			}, {
				type: "statement",
				name: "ultrasoundPing",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "超声波"
				}, {
					id: "SENSOR",
					type: "dynamic-select",
					options: "ultrasounds"
				}, {
					type: "text",
					value: "Ping"
				}],
				code: "{SENSOR}.Ping();",
				tags: ["module"],
				module: "ultrasound"
			}, {
				type: "output",
				name: "ultrasoundGetDistance",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "获取超声波"
				}, {
					id: "SENSOR",
					type: "dynamic-select",
					options: "ultrasounds"
				}, {
					type: "text",
					value: "上次测量的距离"
				}],
				code: "{SENSOR}.getDistance()",
				returnType: {
					type: "simple",
					value: "long"
				},
				tags: ["module"],
				module: "ultrasound"
			}, {
				type: "statement",
				name: "motorRun",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "电机"
				}, {
					id: "MOTOR",
					type: "dynamic-select",
					options: "motors"
				}, {
					type: "text",
					value: "转动，速度为"
				}, {
					id: "SPEED",
					type: "number-input"
				}],
				code: "{MOTOR}.run({SPEED});",
				tags: ["module"],
				module: "motor"
			}, {
				type: "statement",
				name: "motorStop",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "电机"
				}, {
					id: "MOTOR",
					type: "dynamic-select",
					options: "motors"
				}, {
					type: "text",
					value: "停止转动"
				}],
				code: "{MOTOR}.stop();",
				tags: ["module"],
				module: "motor"
			}, {
				type: "statement",
				name: "buzzer",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "蜂鸣器"
				}, {
					id: "BUZZER",
					type: "dynamic-select",
					options: "buzzers"
				}, {
					type: "text",
					value: "发出音阶"
				}, {
					id: "NOTE",
					type: "static-select",
					options: [{
						label: "Do",
						value: "261"
					}, {
						label: "Re",
						value: "293"
					}, {
						label: "Mi",
						value: "329"
					}, {
						label: "Fa",
						value: "349"
					}, {
						label: "Sol",
						value: "392"
					}, {
						label: "La",
						value: "440"
					}, {
						label: "Si",
						value: "494"
					}]
				}, {
					type: "text",
					value: "持续"
				}, {
					id: "SECONDS",
					type: "number-input",
					value: 2000
				}, {
					type: "text",
					value: "毫秒"
				}],
				code: "tone({BUZZER},{NOTE},{SECONDS});\ndelay({SECONDS});",
				tags: ["module"],
				module: "buzzer"
			}, {
				type: "statement",
				name: "buzzerClose",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "关闭蜂鸣器"
				}, {
					id: "BUZZER",
					type: "dynamic-select",
					options: "buzzers"
				}],
				code: "noTone({BUZZER});",
				tags: ["module"],
				module: "buzzer"
			}, {
				type: "statement",
				name: "continuousServoStart",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "设置舵机"
				}, {
					id: "SERVO",
					type: "dynamic-select",
					options: "continuousServos"
				}, {
					type: "text",
					value: "方向为"
				}, {
					id: "DIRECTION",
					type: "static-select",
					options: [{
						label: "顺时针",
						value: "180"
					}, {
						label: "逆时针",
						value: "0"
					}]
				}],
				code: "{SERVO}.write({DIRECTION});",
				tags: ["module"],
				module: "continuousServo"
			}, {
				type: "statement",
				name: "continuousServoStop",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "停止舵机"
				}, {
					id: "SERVO",
					type: "dynamic-select",
					options: "continuousServos"
				}, {
					type: "text",
					value: "转动"
				}],
				code: "{SERVO}.write(90);",
				tags: ["module"],
				module: "continuousServo"
			}, {
				type: "statement",
				name: "lcdTurnOnOff",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					id: "STATE",
					type: "static-select",
					options: [{
						label: "打开",
						value: "backlight"
					}, {
						label: "关闭",
						value: "noBacklight"
					}]
				}, {
					id: "LCD",
					type: "dynamic-select",
					options: "lcds"
				}, {
					type: "text",
					value: "的背光"
				}],
				code: "{LCD}.{STATE}();",
				tags: ["module"],
				module: "lcd"
			}, {
				type: "statement",
				name: "lcdWrite",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "在液晶"
				}, {
					id: "LCD",
					type: "dynamic-select",
					options: "lcds"
				}, {
					type: "text",
					value: "上显示"
				}, {
					id: "TEXT",
					type: "string-input",
					placeholder: "Hi!"
				}],
				code: "{LCD}.print(\"{TEXT}\");",
				tags: ["module"],
				module: "lcd"
			}, {
				type: "statement",
				name: "lcdWritePosition",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "在液晶"
				}, {
					id: "LCD",
					type: "dynamic-select",
					options: "lcds"
				}, {
					id: "ROW",
					type: "number-input",
					value: 0
				}, {
					type: "text",
					value: "行"
				}, {
					id: "COLUMN",
					type: "number-input",
					value: 0
				}, {
					type: "text",
					value: "列"
				}, {
					type: "text",
					value: "上显示"
				}, {
					id: "TEXT",
					type: "string-input",
					placeholder: "Hi!"
				}],
				code: "{LCD}.setCursor({COLUMN},{ROW});{LCD}.print(\"{TEXT}\");",
				tags: ["module"],
				module: "lcd"
			}, {
				type: "statement",
				name: "lcdClear",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "清屏"
				}, {
					id: "LCD",
					type: "dynamic-select",
					options: "lcds"
				}],
				code: "{LCD}.clear();",
				tags: ["module"],
				module: "lcd"
			}, {
				type: "statement",
				name: "led",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					id: "STATE",
					type: "static-select",
					options: [{
						label: "点亮",
						value: "HIGH"
					}, {
						label: "关闭",
						value: "LOW"
					}]
				}, {
					type: "text",
					value: "LED"
				}, {
					id: "LED",
					type: "dynamic-select",
					options: "leds"
				}],
				code: "digitalWrite({LED},{STATE});",
				tags: ["module"],
				module: "led"
			}, {
				type: "statement",
				name: "rgbLedSimple",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "点亮三色LED"
				}, {
					id: "LED",
					type: "dynamic-select",
					options: "rgbs"
				}, {
					type: "text",
					value: "设置为"
				}, {
					id: "COLOR",
					type: "static-select",
					options: [{
						label: "白色",
						value: "255,255,255"
					}, {
						label: "黄色",
						value: "255,255,0"
					}, {
						label: "橙色",
						value: "200,50,0"
					}, {
						label: "红色",
						value: "255,0,0"
					}, {
						label: "深绿",
						value: "0,60,102"
					}, {
						label: "蓝色",
						value: "40,40,255"
					}, {
						label: "深蓝",
						value: "0,0,255"
					}, {
						label: "粉红",
						value: "255,0,255"
					}]
				}],
				code: "{LED}.setRGBcolor({COLOR});",
				tags: ["module"],
				module: "rgb"
			}, {
				type: "statement",
				name: "rgbLed",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "点亮三色LED"
				}, {
					id: "LED",
					type: "dynamic-select",
					options: "rgbs"
				}, {
					type: "text",
					value: "色值红色为"
				}, {
					id: "RED",
					type: "number-input",
					value: 0
				}, {
					type: "text",
					value: "绿色为"
				}, {
					id: "GREEN",
					type: "number-input",
					value: 0
				}, {
					type: "text",
					value: "蓝色为"
				}, {
					id: "BLUE",
					type: "number-input",
					value: 0
				}],
				code: "{LED}.setRGBcolor({RED},{GREEN},{BLUE});",
				tags: ["module"],
				module: "rgb"
			}, {
				type: "statement",
				name: "rgbLedFade",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "让三色LED渐变"
				}, {
					id: "LED",
					type: "dynamic-select",
					options: "rgbs"
				}, {
					type: "text",
					value: "色值红色为"
				}, {
					id: "RED",
					type: "number-input",
					value: 0
				}, {
					type: "text",
					value: "绿色为"
				}, {
					id: "GREEN",
					type: "number-input",
					value: 0
				}, {
					type: "text",
					value: "蓝色为"
				}, {
					id: "BLUE",
					type: "number-input",
					value: 0
				}],
				code: "{LED}.crossFade({RED},{GREEN},{BLUE});",
				tags: ["module"],
				module: "rgb"
			}, {
				type: "statement",
				name: "rtcInit",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "更新时间"
				}, {
					id: "RTC",
					type: "dynamic-select",
					options: "rtcs"
				}],
				code: "{RTC}.adjust(DateTime(__DATE__, __TIME__));",
				tags: ["module"],
				module: "rtc"
			}, {
				type: "output",
				name: "rtcGet",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "获取"
				}, {
					id: "RTC",
					type: "dynamic-select",
					options: "rtcs"
				}, {
					type: "text",
					value: "的"
				}, {
					id: "RTC_FUNC",
					type: "static-select",
					options: [{
						label: "日期",
						value: "getDate"
					}, {
						label: "小时",
						value: "getTime"
					}]
				}],
				code: "{RTC}.{RTC_FUNC}()",
				returnType: {
					type: "simple",
					value: "String"
				},
				tags: ["module"],
				module: "rtc"
			}, {
				type: "output",
				name: "rtcGet-v2",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "获取"
				}, {
					id: "RTC",
					type: "dynamic-select",
					options: "rtcs"
				}, {
					type: "text",
					value: "的"
				}, {
					id: "FUNCTION",
					type: "static-select",
					options: [{
						label: "小时",
						value: "getHour"
					}, {
						label: "分钟",
						value: "getMinute"
					}, {
						label: "秒",
						value: "getSecond"
					}, {
						label: "天",
						value: "getDay"
					}, {
						label: "月",
						value: "getMonth"
					}, {
						label: "年",
						value: "getYear"
					}]
				}],
				code: "{RTC}.{FUNCTION}()",
				returnType: {
					type: "simple",
					value: "int"
				},
				tags: ["module"],
				module: "rtc"
			}, {
				type: "statement",
				name: "oscillator",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "Oscillate servo"
				}, {
					id: "OSCILLATOR",
					type: "dynamic-select",
					options: "oscillators"
				}, {
					type: "text",
					value: "around"
				}, {
					id: "PHASE",
					type: "number-input",
					value: 90
				}, {
					type: "text",
					value: "with amplitude"
				}, {
					id: "AMPLITUDE",
					type: "number-input",
					value: 90
				}, {
					type: "text",
					value: "with speed"
				}, {
					id: "SPEED",
					type: "number-input",
					value: 2000
				}],
				code: "{OSCILLATOR}.SetO({PHASE});{OSCILLATOR}.SetA({AMPLITUDE});{OSCILLATOR}.SetT({SPEED});{OSCILLATOR}.refresh();",
				tags: ["module"],
				module: "oscillator"
			}, {
				type: "statement",
				name: "oscillatorStart",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "Start oscillator"
				}, {
					id: "OSCILLATOR",
					type: "dynamic-select",
					options: "oscillators"
				}],
				code: "{OSCILLATOR}.Play();",
				tags: ["module"],
				module: "oscillator"
			}, {
				type: "statement",
				name: "oscillatorStop",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "Stop oscillator"
				}, {
					id: "OSCILLATOR",
					type: "dynamic-select",
					options: "oscillators"
				}],
				code: "{OSCILLATOR}.Stop();",
				tags: ["module"],
				module: "oscillator"
			}, {
				type: "statement",
				name: "servoNormal",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "设置舵机"
				}, {
					id: "SERVO",
					type: "dynamic-select",
					options: "servos"
				}, {
					type: "text",
					value: "角度为"
				}, {
					id: "POSITION",
					type: "number-input",
					value: 90
				}, {
					type: "text",
					value: "度"
				}],
				code: "{SERVO}.write({POSITION});",
				tags: ["module"],
				module: "servo"
			}, {
				type: "output",
				name: "serialReceive",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "接收串口数据"
				}],
				code: "Serial.read()",
				returnType: {
					type: "simple",
					value: "char"
				},
				tags: ["module"],
				module: "serial"
			}, {
				type: "statement",
				name: "serialSend-v1",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "f8471331-86fc-4e8e-9293-8ddd1bca79a5"
				}],
				content: [{
					type: "text",
					value: "串口发送"
				}, {
					blockInputId: "DATA",
					type: "block-input",
					acceptType: "all",
					name: "f8471331-86fc-4e8e-9293-8ddd1bca79a5"
				}, {
					id: "LN",
					type: "static-select",
					options: [{
						label: "有换行符",
						value: "println"
					}, {
						label: "没有换行符",
						value: "print"
					}]
				}],
				code: "Serial.{LN}({DATA});",
				tags: ["module"],
				module: "serial"
			}, {
				type: "output",
				name: "returnComponent",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "返回"
				}, {
					id: "COMPONENT",
					type: "dynamic-select",
					options: "components"
				}],
				code: "{COMPONENT}",
				returnType: {
					type: "fromDynamicSelect",
					id: "COMPONENT",
					options: "components"
				},
				tags: ["module", "advanced"],
				module: "component"
			}, {
				type: "statement",
				name: "buzzerAdvanced",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "b57fc0e6-15ae-49b6-965b-42460821a5f2"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "4b4393d0-ce5e-45e6-b83e-a45f9530d5a2"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "b38394fc-9676-494a-b44a-94f658cd9319"
				}],
				content: [{
					type: "text",
					value: "蜂鸣器"
				}, {
					blockInputId: "BUZZER",
					type: "block-input",
					acceptType: "all",
					name: "b57fc0e6-15ae-49b6-965b-42460821a5f2"
				}, {
					type: "text",
					value: "发出频率"
				}, {
					blockInputId: "NOTE",
					type: "block-input",
					acceptType: "all",
					name: "4b4393d0-ce5e-45e6-b83e-a45f9530d5a2"
				}, {
					type: "text",
					value: "持续"
				}, {
					blockInputId: "SECONDS",
					type: "block-input",
					acceptType: "all",
					name: "b38394fc-9676-494a-b44a-94f658cd9319"
				}, {
					type: "text",
					value: "毫秒"
				}],
				code: "tone({BUZZER},{NOTE},{SECONDS});\ndelay({SECONDS});",
				tags: ["module", "advanced"]
			}, {
				type: "statement",
				name: "motorRunAdvanced",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "a3ea169d-374d-4c22-886a-28111090a21d"
				}],
				content: [{
					type: "text",
					value: "电机"
				}, {
					id: "MOTOR",
					type: "dynamic-select",
					options: "motors"
				}, {
					type: "text",
					value: "转动，速度为"
				}, {
					blockInputId: "SPEED",
					type: "block-input",
					acceptType: "all",
					name: "a3ea169d-374d-4c22-886a-28111090a21d"
				}],
				code: "{MOTOR}.run({SPEED});",
				tags: ["module", "advanced"],
				module: "motor"
			}, {
				type: "statement",
				name: "continuousServoStartAdvanced-v1",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "1484b139-1fe7-4eaa-b015-49989cbd89d3"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "5b0354c0-8e85-4755-9e03-95525f1057a9"
				}],
				content: [{
					type: "text",
					value: "设置舵机"
				}, {
					blockInputId: "SERVO",
					type: "block-input",
					acceptType: "all",
					name: "1484b139-1fe7-4eaa-b015-49989cbd89d3"
				}, {
					type: "text",
					value: "方向为"
				}, {
					blockInputId: "DIRECTION",
					type: "block-input",
					acceptType: "all",
					name: "5b0354c0-8e85-4755-9e03-95525f1057a9"
				}],
				code: "{SERVO}.write({DIRECTION});",
				tags: ["module", "advanced"]
			}, {
				type: "statement",
				name: "continuousServoStopAdvanced",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "584cafc9-1451-42fb-a56b-a219a4db672e"
				}],
				content: [{
					type: "text",
					value: "停止舵机"
				}, {
					blockInputId: "SERVO",
					type: "block-input",
					acceptType: "all",
					name: "584cafc9-1451-42fb-a56b-a219a4db672e"
				}, {
					type: "text",
					value: "转动"
				}],
				code: "{SERVO}.write(90);",
				tags: ["module", "advanced"]
			}, {
				type: "statement",
				name: "lcdTurnOnOffAdvanced",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "6e9f7268-0bf0-45f2-97d8-428034412094"
				}],
				content: [{
					id: "STATE",
					type: "static-select",
					options: [{
						label: "打开",
						value: "backlight"
					}, {
						label: "关闭",
						value: "noBacklight"
					}]
				}, {
					blockInputId: "LCD",
					type: "block-input",
					acceptType: "all",
					name: "6e9f7268-0bf0-45f2-97d8-428034412094"
				}, {
					type: "text",
					value: "的背光"
				}],
				code: "{LCD}.{STATE}();",
				tags: ["module", "advanced"]
			}, {
				type: "statement",
				name: "lcdWriteAdvanced",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "0ff787be-1b73-4c85-84e0-f38651e4a29d"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "087df5f7-1ad4-4fcf-923b-3c8866b13512"
				}],
				content: [{
					type: "text",
					value: "在液晶"
				}, {
					blockInputId: "LCD",
					type: "block-input",
					acceptType: "all",
					name: "087df5f7-1ad4-4fcf-923b-3c8866b13512"
				}, {
					type: "text",
					value: "上显示"
				}, {
					blockInputId: "TEXT",
					type: "block-input",
					acceptType: "all",
					name: "0ff787be-1b73-4c85-84e0-f38651e4a29d"
				}],
				code: "{LCD}.print({TEXT});",
				tags: ["module", "advanced"]
			}, {
				type: "statement",
				name: "ledAdvanced",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "9050f447-06fe-4956-bd2b-a440ce757f52"
				}],
				content: [{
					id: "STATE",
					type: "static-select",
					options: [{
						label: "点亮",
						value: "HIGH"
					}, {
						label: "关闭",
						value: "LOW"
					}]
				}, {
					type: "text",
					value: "LED"
				}, {
					blockInputId: "LED",
					type: "block-input",
					acceptType: "all",
					name: "9050f447-06fe-4956-bd2b-a440ce757f52"
				}],
				code: "digitalWrite({LED},{STATE});",
				tags: ["module", "advanced"]
			}, {
				type: "statement",
				name: "encoderWriteAdvanced",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "b444f54e-ce20-4b09-a246-cc6c4ec4ee1b"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "f76dc724-1666-4d74-9d58-0733fbe78071"
				}],
				content: [{
					type: "text",
					value: "旋转编码器"
				}, {
					blockInputId: "ENCODER",
					type: "block-input",
					acceptType: "all",
					name: "b444f54e-ce20-4b09-a246-cc6c4ec4ee1b"
				}, {
					type: "text",
					value: "写入"
				}, {
					blockInputId: "VALUE",
					type: "block-input",
					acceptType: "all",
					name: "f76dc724-1666-4d74-9d58-0733fbe78071"
				}],
				code: "{ENCODER}.write({VALUE});",
				tags: ["module", "advanced"]
			}, {
				type: "statement",
				name: "rgbLedAdvanced",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "03fafc3a-a1f9-4422-a3ce-ca9e554e1476"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "937f2ffe-5fb2-4c93-a032-da86f0d8f3ab"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "09b65f04-37b9-4a60-b9a6-e063eef8334e"
				}],
				content: [{
					type: "text",
					value: "点亮三色LED"
				}, {
					id: "LED",
					type: "dynamic-select",
					options: "rgbs"
				}, {
					type: "text",
					value: "色值红色为"
				}, {
					blockInputId: "RED",
					type: "block-input",
					acceptType: "all",
					name: "03fafc3a-a1f9-4422-a3ce-ca9e554e1476"
				}, {
					type: "text",
					value: "绿色为"
				}, {
					blockInputId: "GREEN",
					type: "block-input",
					acceptType: "all",
					name: "937f2ffe-5fb2-4c93-a032-da86f0d8f3ab"
				}, {
					type: "text",
					value: "蓝色为"
				}, {
					blockInputId: "BLUE",
					type: "block-input",
					acceptType: "all",
					name: "09b65f04-37b9-4a60-b9a6-e063eef8334e"
				}],
				code: "{LED}.setRGBcolor({RED},{GREEN},{BLUE});",
				tags: ["module", "advanced"],
				module: "rgb"
			}, {
				type: "statement",
				name: "oscillatorAdvanced",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "7df60b80-3437-452c-a01c-b2eb70f38a9a"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "85c20ede-0585-478b-bddf-b5ce72e632f9"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "990e249d-9108-4fbf-86c5-1d5200572995"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "8a83d1fa-74d9-4993-afd1-0c14796e169a"
				}],
				content: [{
					type: "text",
					value: "Oscillate servo"
				}, {
					blockInputId: "OSCILLATOR",
					type: "block-input",
					acceptType: "all",
					name: "7df60b80-3437-452c-a01c-b2eb70f38a9a"
				}, {
					type: "text",
					value: "around"
				}, {
					blockInputId: "PHASE",
					type: "block-input",
					acceptType: "all",
					name: "85c20ede-0585-478b-bddf-b5ce72e632f9"
				}, {
					type: "text",
					value: "with amplitude"
				}, {
					blockInputId: "AMPLITUDE",
					type: "block-input",
					acceptType: "all",
					name: "990e249d-9108-4fbf-86c5-1d5200572995"
				}, {
					type: "text",
					value: "with speed"
				}, {
					blockInputId: "SPEED",
					type: "block-input",
					acceptType: "all",
					name: "8a83d1fa-74d9-4993-afd1-0c14796e169a"
				}],
				code: "{OSCILLATOR}.SetO({PHASE});\n{OSCILLATOR}.SetA({AMPLITUDE});\n{OSCILLATOR}.SetT({SPEED});\n{OSCILLATOR}.refresh();",
				tags: ["module", "advanced"]
			}, {
				type: "statement",
				name: "oscillatorStartAdvanced",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "b0e8f5b3-a867-424d-ba93-22ff7406bd26"
				}],
				content: [{
					type: "text",
					value: "Oscillator"
				}, {
					blockInputId: "OSCILLATOR",
					type: "block-input",
					acceptType: "all",
					name: "b0e8f5b3-a867-424d-ba93-22ff7406bd26"
				}],
				code: "{OSCILLATOR}.start()",
				tags: ["module", "advanced"]
			}, {
				type: "statement",
				name: "oscillatorStopAdvanced",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "b489257c-fc38-493b-93b2-b3311db488b4"
				}],
				content: [{
					type: "text",
					value: "Stop oscillator"
				}, {
					blockInputId: "OSCILLATOR",
					type: "block-input",
					acceptType: "all",
					name: "b489257c-fc38-493b-93b2-b3311db488b4"
				}],
				code: "{OSCILLATOR}.stop()",
				tags: ["module", "advanced"]
			}, {
				type: "statement",
				name: "servoNormalAdvanced",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "78baf27b-134e-493c-87cf-c89193802711"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "90672fb5-8f1f-45d2-82de-9415185c2b44"
				}],
				content: [{
					type: "text",
					value: "设置舵机"
				}, {
					blockInputId: "SERVO",
					type: "block-input",
					acceptType: "all",
					name: "78baf27b-134e-493c-87cf-c89193802711"
				}, {
					type: "text",
					value: "角度为"
				}, {
					blockInputId: "POSITION",
					type: "block-input",
					acceptType: "all",
					name: "90672fb5-8f1f-45d2-82de-9415185c2b44"
				}, {
					type: "text",
					value: "度"
				}],
				code: "{SERVO}.write({POSITION});",
				tags: ["module", "advanced"]
			}, {
				type: "statement",
				name: "lcdWritePositionAdvanced",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "5b8ac541-9ef8-48fa-b798-04ef13c0ef83"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "ff3bf8e8-5438-4a0d-822a-346d8838af7d"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "7ed6194c-1253-4ac3-a1cd-c5a1b0334e8a"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "c0f6dffb-bbb6-4906-bb65-313ee54e26b9"
				}],
				content: [{
					type: "text",
					value: "在液晶"
				}, {
					blockInputId: "LCD",
					type: "block-input",
					acceptType: "all",
					name: "ff3bf8e8-5438-4a0d-822a-346d8838af7d"
				}, {
					blockInputId: "ROW",
					type: "block-input",
					acceptType: "all",
					name: "c0f6dffb-bbb6-4906-bb65-313ee54e26b9"
				}, {
					type: "text",
					value: "行"
				}, {
					blockInputId: "COLUMN",
					type: "block-input",
					acceptType: "all",
					name: "7ed6194c-1253-4ac3-a1cd-c5a1b0334e8a"
				}, {
					type: "text",
					value: "列"
				}, {
					type: "text",
					value: "上显示"
				}, {
					blockInputId: "TEXT",
					type: "block-input",
					acceptType: "all",
					name: "5b8ac541-9ef8-48fa-b798-04ef13c0ef83"
				}],
				code: "{LCD}.setCursor({COLUMN},{ROW});{LCD}.print({TEXT});",
				tags: ["module", "advanced"]
			}, {
				type: "statement-input",
				name: "voidFunction",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-root",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "定义函数"
				}, {
					id: "FUNCNAME",
					type: "var-input",
					placeholder: "名字"
				}],
				createDynamicContent: "voidFunctions",
				returnType: {
					type: "simple",
					value: "void"
				},
				code: "void {FUNCNAME}(){{STATEMENTS}}",
				tags: ["function"]
			}, {
				type: "statement",
				name: "invokeFunction",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "调用函数"
				}, {
					id: "FUNCTION",
					type: "dynamic-select",
					options: "voidFunctions"
				}],
				code: "{FUNCTION}();",
				tags: ["function"]
			}, {
				type: "statement-input",
				name: "returnFunction",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-root",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "10711311-e515-493b-ba2b-22899b993034"
				}],
				content: [{
					type: "text",
					value: "定义函数"
				}, {
					id: "FUNCNAME",
					type: "var-input",
					placeholder: "名字"
				}, {
					extra: true,
					type: "text",
					value: "返回"
				}, {
					extra: true,
					blockInputId: "RETURN",
					type: "block-input",
					acceptType: "all",
					name: "10711311-e515-493b-ba2b-22899b993034"
				}],
				createDynamicContent: "returnFunctions",
				returnType: {
					type: "fromInput",
					blockInputId: "RETURN"
				},
				code: "{RETURN.connectionType} {FUNCNAME}() {{STATEMENTS}return {RETURN};}",
				tags: ["function"]
			}, {
				type: "output",
				name: "invokeReturnFunction",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "调用函数"
				}, {
					id: "FUNCTION",
					type: "dynamic-select",
					options: "returnFunctions"
				}],
				code: "{FUNCTION}()",
				returnType: {
					type: "fromDynamicSelect",
					id: "FUNCTION",
					options: "returnFunctions"
				},
				tags: ["function"]
			}, {
				type: "statement-input",
				name: "voidFunctionWithArguments",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-root",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "e9864451-638d-4c6e-bd6b-69bd4af0cb68"
				}],
				content: [{
					type: "text",
					value: "定义函数"
				}, {
					id: "FUNCNAME",
					type: "var-input",
					placeholder: "名字"
				}, {
					type: "text",
					value: "并带这些参数:"
				}, {
					blockInputId: "ARGS",
					type: "block-input",
					acceptType: "all",
					name: "e9864451-638d-4c6e-bd6b-69bd4af0cb68"
				}],
				createDynamicContent: "voidFunctions",
				returnType: {
					type: "simple",
					value: "void"
				},
				arguments: {
					type: "fromInput",
					blockInputId: "ARGS"
				},
				code: "void {FUNCNAME} ({ARGS}){{STATEMENTS}}",
				tags: ["function", "advanced"]
			}, {
				type: "statement",
				name: "invokeFunctionWithArguments",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "fe804f29-2a6b-4e0e-a02b-8c2ae96e4472"
				}],
				content: [{
					type: "text",
					value: "调用函数"
				}, {
					id: "FUNCTION",
					type: "dynamic-select",
					options: "voidFunctions"
				}, {
					type: "text",
					value: "用这些参数:"
				}, {
					blockInputId: "ARGS",
					type: "block-input",
					acceptType: "all",
					name: "fe804f29-2a6b-4e0e-a02b-8c2ae96e4472"
				}],
				code: "{FUNCTION}({ARGS});",
				tags: ["function", "advanced"]
			}, {
				type: "statement-input",
				name: "returnFunctionWithArguments",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-root",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "10f62c3e-5a74-42b1-bd7b-b62e7ba82246"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "e4eaed75-8741-45ea-8dd0-bbd9776295dd"
				}],
				content: [{
					type: "text",
					value: "定义函数"
				}, {
					id: "FUNCNAME",
					type: "var-input",
					placeholder: "名字"
				}, {
					type: "text",
					value: "并带这些参数:"
				}, {
					blockInputId: "ARGS",
					type: "block-input",
					acceptType: "all",
					name: "10f62c3e-5a74-42b1-bd7b-b62e7ba82246"
				}, {
					extra: true,
					type: "text",
					value: "返回"
				}, {
					extra: true,
					blockInputId: "RETURN",
					type: "block-input",
					acceptType: "all",
					name: "e4eaed75-8741-45ea-8dd0-bbd9776295dd"
				}],
				createDynamicContent: "returnFunctions",
				returnType: {
					type: "fromInput",
					blockInputId: "RETURN"
				},
				arguments: {
					type: "fromInput",
					blockInputId: "ARGS"
				},
				code: "{RETURN.connectionType} {FUNCNAME} ({ARGS}) {{STATEMENTS}return {RETURN};}",
				tags: ["function", "advanced"]
			}, {
				type: "output",
				name: "invokeReturnFunctionWithArguments",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "51828a12-4317-4316-9d88-12f2d127f447"
				}],
				content: [{
					type: "text",
					value: "调用函数"
				}, {
					id: "FUNCTION",
					type: "dynamic-select",
					options: "returnFunctions"
				}, {
					type: "text",
					value: "用这些参数:"
				}, {
					blockInputId: "ARGS",
					type: "block-input",
					acceptType: "all",
					name: "51828a12-4317-4316-9d88-12f2d127f447"
				}],
				code: "{FUNCTION}({ARGS})",
				returnType: {
					type: "fromDynamicSelect",
					id: "FUNCTION",
					options: "returnFunctions"
				},
				tags: ["function", "advanced"]
			}, {
				type: "output",
				name: "argument",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "变量"
				}, {
					id: "TYPE",
					type: "static-select",
					options: [{
						label: "整数",
						value: "int"
					}, {
						label: "浮点数",
						value: "float"
					}, {
						label: "文本",
						value: "String"
					}, {
						label: "字符",
						value: "char"
					}, {
						label: "布尔",
						value: "bool"
					}]
				}, {
					id: "VARNAME",
					type: "var-input",
					value: ""
				}],
				createDynamicContent: "vars",
				code: "{TYPE} {VARNAME}",
				returnType: {
					type: "fromDropdown",
					id: "TYPE",
					options: "vars"
				},
				tags: ["function", "advanced"]
			}, {
				type: "output",
				name: "arguments",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "d7e20b5c-3939-4e96-93dc-30aebf2b64c9"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "99234802-2fbc-4866-b413-f1af75abfdf6"
				}],
				content: [{
					blockInputId: "ARG1",
					type: "block-input",
					acceptType: "all",
					name: "d7e20b5c-3939-4e96-93dc-30aebf2b64c9"
				}, {
					type: "text",
					value: ","
				}, {
					blockInputId: "ARG2",
					type: "block-input",
					acceptType: "all",
					name: "99234802-2fbc-4866-b413-f1af75abfdf6"
				}],
				createDynamicContent: "vars",
				code: "{ARG1},{ARG2}",
				returnType: {
					type: "simple",
					value: "var"
				},
				tags: ["function", "advanced"]
			}, {
				type: "statement",
				name: "return",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "71c95139-77d4-42d0-8646-88e432b48cd5"
				}],
				content: [{
					type: "text",
					value: "返回"
				}, {
					blockInputId: "RETURN",
					type: "block-input",
					acceptType: "all",
					name: "71c95139-77d4-42d0-8646-88e432b48cd5"
				}],
				code: "return {RETURN};",
				tags: ["function", "advanced"]
			}, {
				type: "statement",
				name: "declareVariable",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "30694572-fbd8-41c3-b005-58b61c5d5de0"
				}],
				content: [{
					type: "text",
					value: "定义变量"
				}, {
					id: "NAME",
					type: "var-input",
					value: ""
				}, {
					type: "text",
					value: "="
				}, {
					blockInputId: "VALUE",
					type: "block-input",
					acceptType: "all",
					name: "30694572-fbd8-41c3-b005-58b61c5d5de0"
				}],
				returnType: {
					type: "fromInput",
					blockInputId: "VALUE"
				},
				createDynamicContent: "vars",
				code: "{VALUE.connectionType} {NAME} = {VALUE};",
				tags: ["var"]
			}, {
				type: "output",
				name: "selectVariable",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "变量"
				}, {
					id: "VAR",
					type: "dynamic-select",
					options: "vars"
				}],
				code: "{VAR}",
				returnType: {
					type: "fromDynamicSelect",
					id: "VAR",
					options: "vars"
				},
				tags: ["var"]
			}, {
				type: "statement",
				name: "setVariable",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "464bec0a-cfec-4ccf-a376-ba30ca1387ff"
				}],
				content: [{
					type: "text",
					value: "变量"
				}, {
					id: "NAME",
					type: "dynamic-select",
					options: "vars"
				}, {
					type: "text",
					value: "="
				}, {
					blockInputId: "VALUE",
					type: "block-input",
					acceptType: {
						type: "fromDynamicSelect",
						id: "NAME",
						options: "vars"
					},
					name: "464bec0a-cfec-4ccf-a376-ba30ca1387ff"
				}],
				code: "{NAME} = {VALUE};",
				tags: ["var"]
			}, {
				type: "output",
				name: "arrayVariable",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "变量"
				}, {
					id: "VAR",
					type: "dynamic-select",
					options: "vars"
				}, {
					type: "text",
					value: "["
				}, {
					id: "POSITION",
					type: "number-input",
					value: 0
				}, {
					type: "text",
					value: "]"
				}],
				code: "{VAR}[{POSITION}]",
				returnType: {
					type: "fromDynamicSelect",
					id: "VAR",
					pointer: "true",
					options: "vars"
				},
				tags: ["var"]
			}, {
				type: "statement",
				name: "setArrayVariable",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: {
						type: "fromDynamicSelect",
						id: "NAME",
						pointer: "true",
						options: "vars"
					},
					name: "e6031a11-ad01-470b-ae8d-ffb05b1f5384"
				}],
				content: [{
					type: "text",
					value: "变量"
				}, {
					id: "NAME",
					type: "dynamic-select",
					options: "vars"
				}, {
					type: "text",
					value: "["
				}, {
					id: "ITERATOR",
					type: "number-input",
					value: 0
				}, {
					type: "text",
					value: "]"
				}, {
					type: "text",
					value: "="
				}, {
					blockInputId: "VALUE",
					type: "block-input",
					acceptType: {
						type: "fromDynamicSelect",
						id: "NAME",
						pointer: "true",
						options: "vars"
					},
					name: "e6031a11-ad01-470b-ae8d-ffb05b1f5384"
				}],
				code: "{NAME}[{ITERATOR}] = {VALUE};",
				tags: ["var"]
			}, {
				type: "output",
				name: "arrayVariableAdvanced",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "ffd52cf5-42da-4f8a-aab2-d9b9a4f4e349"
				}],
				content: [{
					type: "text",
					value: "变量"
				}, {
					id: "VAR",
					type: "dynamic-select",
					options: "vars"
				}, {
					type: "text",
					value: "["
				}, {
					blockInputId: "POSITION",
					type: "block-input",
					acceptType: "all",
					name: "ffd52cf5-42da-4f8a-aab2-d9b9a4f4e349"
				}, {
					type: "text",
					value: "]"
				}],
				code: "{VAR}[{POSITION}]",
				returnType: {
					type: "fromDynamicSelect",
					id: "VAR",
					pointer: "true",
					options: "vars"
				},
				tags: ["var", "advanced"]
			}, {
				type: "statement",
				name: "setArrayVariableAdvanced",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "e9510b5d-42e8-4e6c-8410-532e170d7b49"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "5bb90cb1-09df-441f-aac5-d936db4f3a49"
				}],
				content: [{
					type: "text",
					value: "变量"
				}, {
					id: "NAME",
					type: "dynamic-select",
					options: "vars"
				}, {
					type: "text",
					value: "["
				}, {
					blockInputId: "ITERATOR",
					type: "block-input",
					acceptType: "all",
					name: "e9510b5d-42e8-4e6c-8410-532e170d7b49"
				}, {
					type: "text",
					value: "]"
				}, {
					type: "text",
					value: "="
				}, {
					blockInputId: "VALUE",
					type: "block-input",
					acceptType: "all",
					name: "5bb90cb1-09df-441f-aac5-d936db4f3a49"
				}],
				code: "{NAME}[{ITERATOR}] = {VALUE};",
				tags: ["var", "advanced"]
			}, {
				type: "statement",
				name: "declareVariableAdvanced",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "5acbea42-4537-40d4-adbb-04e00cd31ef0"
				}],
				content: [{
					type: "text",
					value: "定义变量"
				}, {
					id: "NAME",
					type: "var-input",
					value: ""
				}, {
					type: "text",
					value: "为类型"
				}, {
					id: "TYPE",
					type: "static-select",
					options: [{
						label: "整数",
						value: "int"
					}, {
						label: "浮点数",
						value: "float"
					}, {
						label: "文本",
						value: "String"
					}, {
						label: "字符",
						value: "char"
					}, {
						label: "布尔",
						value: "bool"
					}]
				}, {
					type: "text",
					value: "="
				}, {
					blockInputId: "VALUE",
					type: "block-input",
					acceptType: "all",
					name: "5acbea42-4537-40d4-adbb-04e00cd31ef0"
				}],
				returnType: {
					type: "fromDropdown",
					id: "TYPE"
				},
				createDynamicContent: "vars",
				code: "{TYPE} {NAME} = {VALUE};",
				tags: ["var", "advanced"]
			}, {
				type: "statement",
				name: "comment",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "注释 //"
				}, {
					id: "COMMENT",
					type: "comment-input",
					placeholder: "输入你的注释"
				}],
				code: "/*\n{COMMENT}\n*/",
				tags: ["code"]
			}, {
				type: "statement",
				name: "code",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					id: "CODE",
					type: "code-input",
					value: "",
					placeholder: "输入你自己的代码"
				}],
				code: "{CODE}\n",
				tags: ["code"]
			}, {
				type: "output",
				name: "number",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					id: "VALUE",
					type: "number-input",
					value: 0
				}],
				code: "{VALUE}",
				returnType: {
					type: "simple",
					value: "float"
				},
				tags: ["math"]
			}, {
				type: "output",
				name: "numberArray",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "大小为"
				}, {
					id: "VALUE",
					type: "number-input",
					value: 3
				}, {
					type: "text",
					value: "的浮点数数组"
				}],
				code: "(float*)malloc({VALUE}*sizeof(float))",
				returnType: {
					type: "simple",
					value: "float *"
				},
				tags: ["math"]
			}, {
				type: "output",
				name: "basicOperations",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "a8e477d9-6623-498b-b65d-a73bdfd7575c"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "5b96efbe-61d9-4c74-a6cd-98164f7374e7"
				}],
				content: [{
					blockInputId: "ARG1",
					type: "block-input",
					acceptType: "all",
					name: "a8e477d9-6623-498b-b65d-a73bdfd7575c"
				}, {
					id: "OPERATOR",
					type: "static-select",
					options: [{
						label: "+",
						value: "+"
					}, {
						label: "-",
						value: "-"
					}, {
						label: "x",
						value: "*"
					}, {
						label: "/",
						value: "/"
					}, {
						label: "^",
						value: "^"
					}, {
						label: "%",
						value: "%"
					}]
				}, {
					blockInputId: "ARG2",
					type: "block-input",
					acceptType: "all",
					name: "5b96efbe-61d9-4c74-a6cd-98164f7374e7"
				}],
				code: "'{OPERATOR}' === '^'? 'pow({ARG1},{ARG2})' : '({ARG1} {OPERATOR} {ARG2})'",
				eval: true,
				returnType: {
					type: "simple",
					value: "float"
				},
				tags: ["math"]
			}, {
				type: "output",
				name: "map",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "float",
					name: "06c5572f-cdc4-45c1-847e-820eea610df5"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "float",
					name: "a38f4793-0c7b-4b8b-94fd-38cb78b8a77d"
				}],
				content: [{
					type: "text",
					value: "把"
				}, {
					blockInputId: "VAR",
					type: "block-input",
					acceptType: "float",
					name: "06c5572f-cdc4-45c1-847e-820eea610df5"
				}, {
					type: "text",
					value: "从0-1024映射到[0-"
				}, {
					blockInputId: "MAXVAL",
					type: "block-input",
					acceptType: "float",
					name: "a38f4793-0c7b-4b8b-94fd-38cb78b8a77d"
				}, {
					type: "text",
					value: "]"
				}],
				code: "map({VAR},0,1023,0,{MAXVAL})",
				returnType: {
					type: "simple",
					value: "float"
				},
				tags: ["math"]
			}, {
				type: "statement",
				name: "randomSeed",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "随机数种子初始化"
				}],
				code: "randomSeed(micros());",
				returnType: {
					type: "simple",
					value: "float"
				},
				tags: ["math"]
			}, {
				type: "output",
				name: "random",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "float",
					name: "dee023ca-cbbc-4054-a515-fa0b52d87027"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "float",
					name: "1563871d-15b3-4456-9d54-2cb7dc0a60ec"
				}],
				content: [{
					type: "text",
					value: "随机数从"
				}, {
					blockInputId: "ARG1",
					type: "block-input",
					acceptType: "float",
					name: "dee023ca-cbbc-4054-a515-fa0b52d87027"
				}, {
					type: "text",
					value: "到"
				}, {
					blockInputId: "ARG2",
					type: "block-input",
					acceptType: "float",
					name: "1563871d-15b3-4456-9d54-2cb7dc0a60ec"
				}],
				code: "random({ARG1},{ARG2}+1)",
				returnType: {
					type: "simple",
					value: "float"
				},
				tags: ["math"]
			}, {
				type: "output",
				name: "mathOperations",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "f3efdecb-5b6c-4311-831b-95d25e3a040d"
				}],
				content: [{
					id: "OPERATOR",
					type: "static-select",
					options: [{
						label: "平方根",
						value: "sqrt"
					}, {
						label: "绝对值",
						value: "abs"
					}, {
						label: "ln",
						value: "log"
					}, {
						label: "log10",
						value: "log10"
					}, {
						label: "e^",
						value: "exp"
					}]
				}, {
					blockInputId: "ARG",
					type: "block-input",
					acceptType: "all",
					name: "f3efdecb-5b6c-4311-831b-95d25e3a040d"
				}],
				code: "{OPERATOR}({ARG})",
				returnType: {
					type: "simple",
					value: "float"
				},
				tags: ["math", "advanced"]
			}, {
				type: "output",
				name: "numberArrayAdvanced",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "c4a2264e-ce23-43de-9cdc-c5033629c07c"
				}],
				content: [{
					type: "text",
					value: "数组，大小:"
				}, {
					blockInputId: "VALUE",
					type: "block-input",
					acceptType: "all",
					name: "c4a2264e-ce23-43de-9cdc-c5033629c07c"
				}, {
					type: "text",
					value: "类型:"
				}, {
					id: "TYPE",
					type: "static-select",
					options: [{
						label: "浮点数",
						value: "float *"
					}, {
						label: "整数",
						value: "int *"
					}]
				}],
				code: "({TYPE})malloc({VALUE}*sizeof({TYPE.withoutAsterisk}))",
				returnType: {
					type: "fromSelect",
					id: "TYPE",
					options: "vars"
				},
				tags: ["math", "advanced"]
			}, {
				type: "output",
				name: "mapAdvanced",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "float",
					name: "59514d4c-e29d-4f7e-892b-4eadfb199ce7"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "float",
					name: "3e2e1b8f-2c0f-49ed-9a59-6abac5294fb4"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "float",
					name: "9a94702d-a6f9-4768-9518-cd49f6f110a8"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "float",
					name: "761ab971-9454-436c-979c-d7528c6667d7"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "float",
					name: "de6ccaba-271c-4103-8a86-4d01ad1c3169"
				}],
				content: [{
					type: "text",
					value: "把"
				}, {
					blockInputId: "VAR",
					type: "block-input",
					acceptType: "float",
					name: "59514d4c-e29d-4f7e-892b-4eadfb199ce7"
				}, {
					type: "text",
					value: "从 ["
				}, {
					blockInputId: "INITMIN",
					type: "block-input",
					acceptType: "float",
					name: "3e2e1b8f-2c0f-49ed-9a59-6abac5294fb4"
				}, {
					type: "text",
					value: "-"
				}, {
					blockInputId: "INITMAX",
					type: "block-input",
					acceptType: "float",
					name: "9a94702d-a6f9-4768-9518-cd49f6f110a8"
				}, {
					type: "text",
					value: "]映射到["
				}, {
					blockInputId: "FINMIN",
					type: "block-input",
					acceptType: "float",
					name: "761ab971-9454-436c-979c-d7528c6667d7"
				}, {
					type: "text",
					value: "-"
				}, {
					blockInputId: "FINMAX",
					type: "block-input",
					acceptType: "float",
					name: "de6ccaba-271c-4103-8a86-4d01ad1c3169"
				}, {
					type: "text",
					value: "]"
				}],
				code: "map({VAR},{INITMIN},{INITMAX},{FINMIN},{FINMAX})",
				returnType: {
					type: "simple",
					value: "float"
				},
				tags: ["math", "advanced"]
			}, {
				type: "output",
				name: "numConversion",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "2389f662-73ff-4bd9-a38b-4fec891cee9e"
				}],
				content: [{
					type: "text",
					value: "把"
				}, {
					blockInputId: "NUMBER",
					type: "block-input",
					acceptType: "all",
					name: "2389f662-73ff-4bd9-a38b-4fec891cee9e"
				}, {
					type: "text",
					value: "转换为"
				}, {
					id: "TYPE",
					type: "static-select",
					options: [{
						label: "整数",
						value: "int"
					}, {
						label: "浮点数",
						value: "float"
					}]
				}],
				code: "({TYPE}) {NUMBER}",
				returnType: {
					type: "fromSelect",
					id: "TYPE"
				},
				tags: ["math", "advanced"]
			}, {
				type: "output",
				name: "string",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "\""
				}, {
					id: "TEXT",
					type: "string-input",
					placeholder: "文本"
				}, {
					type: "text",
					value: "\""
				}],
				code: "\"{TEXT}\"",
				returnType: {
					type: "simple",
					value: "String"
				},
				tags: ["text"]
			}, {
				type: "output",
				name: "stringArray",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "大小为"
				}, {
					id: "VALUE",
					type: "number-input",
					value: 3
				}, {
					type: "text",
					value: "的文本数组"
				}],
				code: "(String *)malloc({VALUE}*sizeof(String))",
				returnType: {
					type: "simple",
					value: "String *"
				},
				tags: ["text"]
			}, {
				type: "output",
				name: "length",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "String",
					name: "6c5e3f13-3984-4864-a5f0-18b7c7b1f91d"
				}],
				content: [{
					type: "text",
					value: "文本长度"
				}, {
					blockInputId: "TEXT",
					type: "block-input",
					acceptType: "String",
					name: "6c5e3f13-3984-4864-a5f0-18b7c7b1f91d"
				}],
				code: "{TEXT}.length()",
				returnType: {
					type: "simple",
					value: "float"
				},
				tags: ["text"]
			}, {
				type: "output",
				name: "stringCreate",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "25ce044c-89da-433d-9a95-9b361825d16d"
				}],
				content: [{
					type: "text",
					value: "创建一个文本"
				}, {
					blockInputId: "TEXT",
					type: "block-input",
					acceptType: "all",
					name: "25ce044c-89da-433d-9a95-9b361825d16d"
				}],
				code: "String({TEXT})",
				returnType: {
					type: "simple",
					value: "String"
				},
				tags: ["text"]
			}, {
				type: "output",
				name: "stringSum",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "String",
					name: "2ab1835b-8c76-426b-a9f7-942f1d2698c9"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "String",
					name: "d3791943-f904-4e2e-ba3f-ff26a0b23165"
				}],
				content: [{
					blockInputId: "ARG1",
					type: "block-input",
					acceptType: "String",
					name: "2ab1835b-8c76-426b-a9f7-942f1d2698c9"
				}, {
					type: "text",
					value: "+"
				}, {
					blockInputId: "ARG2",
					type: "block-input",
					acceptType: "String",
					name: "d3791943-f904-4e2e-ba3f-ff26a0b23165"
				}],
				code: "String({ARG1})+String({ARG2})",
				returnType: {
					type: "simple",
					value: "String"
				},
				tags: ["text"]
			}, {
				type: "output",
				name: "stringArrayAdvanced",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "f6a2e865-4d05-4736-9136-b3b4ce753dc3"
				}],
				content: [{
					type: "text",
					value: "数组，大小:"
				}, {
					blockInputId: "VALUE",
					type: "block-input",
					acceptType: "all",
					name: "f6a2e865-4d05-4736-9136-b3b4ce753dc3"
				}, {
					type: "text",
					value: "类型:"
				}, {
					id: "TYPE",
					type: "static-select",
					options: [{
						label: "文本",
						value: "String *"
					}, {
						label: "字符",
						value: "char *"
					}]
				}],
				code: "({TYPE})malloc({VALUE}*sizeof({TYPE.withoutAsterisk}))",
				returnType: {
					type: "fromDropdown",
					id: "TYPE",
					options: "vars"
				},
				tags: ["text", "advanced"]
			}, {
				type: "output",
				name: "char",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "'"
				}, {
					id: "TEXT",
					type: "char-input",
					placeholder: "字符"
				}, {
					type: "text",
					value: "'"
				}],
				code: "'{TEXT}'",
				returnType: {
					type: "simple",
					value: "char"
				},
				tags: ["text", "advanced"]
			}, {
				type: "statement",
				name: "wait",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "延时"
				}, {
					id: "TIME",
					type: "number-input",
					value: 2000
				}, {
					type: "text",
					value: "毫秒"
				}],
				code: "delay({TIME});",
				tags: ["control"]
			}, {
				type: "output",
				name: "millis",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "获取执行到此刻的时间"
				}],
				code: "millis()",
				returnType: {
					type: "simple",
					value: "float"
				},
				tags: ["control"]
			}, {
				type: "statement-input",
				name: "if",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-root",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "eddef98f-062a-4a63-9798-c557032f429e"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "82e0bc04-84bf-4aa7-96d7-49ed2d9417e5"
				}],
				content: [{
					type: "text",
					value: "如果"
				}, {
					blockInputId: "ARG1",
					type: "block-input",
					acceptType: "all",
					name: "eddef98f-062a-4a63-9798-c557032f429e"
				}, {
					id: "OPERATOR",
					type: "static-select",
					options: [{
						label: "=",
						value: "=="
					}, {
						label: "!=",
						value: "!="
					}, {
						label: ">",
						value: ">"
					}, {
						label: ">=",
						value: ">="
					}, {
						label: "<",
						value: "<"
					}, {
						label: "<=",
						value: "<="
					}]
				}, {
					blockInputId: "ARG2",
					type: "block-input",
					acceptType: "all",
					name: "82e0bc04-84bf-4aa7-96d7-49ed2d9417e5"
				}, {
					type: "text",
					value: "那么"
				}],
				code: "if({ARG1} {OPERATOR} {ARG2}){{STATEMENTS}}",
				tags: ["control"]
			}, {
				type: "statement-input",
				name: "elseif",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-root",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "49b5ddd1-3c08-4252-b580-92dc049016e5"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "e7c6d463-9101-4c25-9376-95429065c9b6"
				}],
				content: [{
					type: "text",
					value: "否则如果"
				}, {
					blockInputId: "ARG1",
					type: "block-input",
					acceptType: "all",
					name: "49b5ddd1-3c08-4252-b580-92dc049016e5"
				}, {
					id: "OPERATOR",
					type: "static-select",
					options: [{
						label: "=",
						value: "=="
					}, {
						label: "!=",
						value: "!="
					}, {
						label: ">",
						value: ">"
					}, {
						label: ">=",
						value: ">="
					}, {
						label: "<",
						value: "<"
					}, {
						label: "<=",
						value: "<="
					}]
				}, {
					blockInputId: "ARG2",
					type: "block-input",
					acceptType: "all",
					name: "e7c6d463-9101-4c25-9376-95429065c9b6"
				}, {
					type: "text",
					value: "那么"
				}],
				code: "else if ({ARG1} {OPERATOR} {ARG2}){{STATEMENTS}}",
				tags: ["control"]
			}, {
				type: "statement-input",
				name: "else",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-root",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "否则，那么"
				}],
				code: "else {{STATEMENTS}}",
				tags: ["control"]
			}, {
				type: "statement-input",
				name: "switch",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-root",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "判断变量"
				}, {
					id: "VAR",
					type: "dynamic-select",
					options: "vars"
				}, {
					type: "text",
					value: "的值为"
				}],
				code: "switch (int({VAR})) {{STATEMENTS}}",
				tags: ["control"]
			}, {
				type: "statement-input",
				name: "case",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-root",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "如果变量值为"
				}, {
					id: "VAR",
					type: "number-input",
					value: 0
				}, {
					type: "text",
					value: "那么"
				}],
				code: "case {VAR}:{{STATEMENTS}break;}",
				tags: ["control", "advanced"]
			}, {
				type: "statement-input",
				name: "caseDefault",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-root",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "如果都不是，那么"
				}],
				code: "default:{{STATEMENTS}break;}",
				tags: ["control", "advanced"]
			}, {
				type: "statement-input",
				name: "for-v1",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-root",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "计数循环变量"
				}, {
					id: "VAR",
					type: "dynamic-select",
					options: "vars"
				}, {
					type: "text",
					value: "从"
				}, {
					id: "INIT",
					type: "number-input",
					value: 0
				}, {
					type: "text",
					value: "到"
				}, {
					id: "FINAL",
					type: "number-input",
					value: 10
				}, {
					id: "MODE",
					type: "static-select",
					options: [{
						label: "自增",
						value: "+"
					}, {
						label: "自减",
						value: "-"
					}]
				}, {
					id: "ADD",
					type: "number-input",
					value: 1
				}, {
					type: "text",
					value: "执行"
				}],
				code: "'for({VAR}={INIT};{VAR}' + ('{MODE}' === '+'?'<=':'>=' ) + '{FINAL};{VAR}{MODE}={ADD}){{STATEMENTS}}'",
				eval: true,
				tags: ["control"]
			}, {
				type: "statement-input",
				name: "while",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-root",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "0c389214-9287-46b5-8b16-6be02393a13e"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "9966db62-ea4f-4197-bfcf-2bb65235eeab"
				}],
				content: [{
					type: "text",
					value: "如果"
				}, {
					blockInputId: "ARG1",
					type: "block-input",
					acceptType: "all",
					name: "0c389214-9287-46b5-8b16-6be02393a13e"
				}, {
					id: "OPERATOR",
					type: "static-select",
					options: [{
						label: "=",
						value: "=="
					}, {
						label: "!=",
						value: "!="
					}, {
						label: ">",
						value: ">"
					}, {
						label: ">=",
						value: ">="
					}, {
						label: "<",
						value: "<"
					}, {
						label: "<=",
						value: "<="
					}]
				}, {
					blockInputId: "ARG2",
					type: "block-input",
					acceptType: "all",
					name: "9966db62-ea4f-4197-bfcf-2bb65235eeab"
				}, {
					type: "text",
					value: "则一直循环执行"
				}],
				code: "while ({ARG1} {OPERATOR} {ARG2}){{STATEMENTS}}",
				tags: ["control"]
			}, {
				type: "statement",
				name: "continue",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "开始下一次循环"
				}],
				code: "continue;",
				tags: ["control", "advanced"]
			}, {
				type: "statement",
				name: "break",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "结束本轮循环"
				}],
				code: "break;",
				tags: ["control", "advanced"]
			}, {
				type: "statement",
				name: "waitAdvanced",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "78693039-07c0-4fd0-ad39-90adad25ae37"
				}],
				content: [{
					type: "text",
					value: "延时"
				}, {
					blockInputId: "TIME",
					type: "block-input",
					acceptType: "all",
					name: "78693039-07c0-4fd0-ad39-90adad25ae37"
				}],
				code: "delay({TIME});",
				tags: ["control", "advanced"]
			}, {
				type: "statement-input",
				name: "ifAdvanced",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-root",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "7e633448-49e7-4aa6-b195-cd98e5b4f4c7"
				}],
				content: [{
					type: "text",
					value: "如果"
				}, {
					blockInputId: "CONDITION",
					type: "block-input",
					acceptType: "all",
					name: "7e633448-49e7-4aa6-b195-cd98e5b4f4c7"
				}, {
					type: "text",
					value: "那么"
				}],
				code: "if({CONDITION}){{STATEMENTS}}",
				tags: ["control", "advanced"]
			}, {
				type: "statement-input",
				name: "elseifAdvanced",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-root",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "c12a4ad0-21ef-4938-adac-32ac49bae0cc"
				}],
				content: [{
					type: "text",
					value: "否则如果"
				}, {
					blockInputId: "VAR",
					type: "block-input",
					acceptType: "all",
					name: "c12a4ad0-21ef-4938-adac-32ac49bae0cc"
				}, {
					type: "text",
					value: "那么"
				}],
				code: "else if ({VAR}){{STATEMENTS}}",
				tags: ["control", "advanced"]
			}, {
				type: "statement-input",
				name: "else",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-root",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "否则，那么"
				}],
				code: "else {{STATEMENTS}}",
				tags: ["control", "advanced"]
			}, {
				type: "statement-input",
				name: "forAdvanced-v1",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-root",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "0baa13b5-5a96-4f16-85d8-c70557f55f76"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "4a2c2c67-d8c8-4b12-b8a4-e4cccdb90ebf"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "d20a2f18-ac40-4ae9-8b8b-6d911558c202"
				}],
				content: [{
					type: "text",
					value: "计数循环变量"
				}, {
					blockInputId: "VAR",
					type: "block-input",
					acceptType: "all",
					name: "0baa13b5-5a96-4f16-85d8-c70557f55f76"
				}, {
					type: "text",
					value: "从"
				}, {
					blockInputId: "INIT",
					type: "block-input",
					acceptType: "all",
					name: "4a2c2c67-d8c8-4b12-b8a4-e4cccdb90ebf"
				}, {
					type: "text",
					value: "到"
				}, {
					blockInputId: "FINAL",
					type: "block-input",
					acceptType: "all",
					name: "d20a2f18-ac40-4ae9-8b8b-6d911558c202"
				}, {
					id: "MODE",
					type: "static-select",
					options: [{
						label: "自增",
						value: "+"
					}, {
						label: "自减",
						value: "-"
					}]
				}, {
					id: "ADD",
					type: "number-input",
					value: 1
				}, {
					type: "text",
					value: "执行"
				}],
				code: "'for({VAR}={INIT};{VAR}' + ('{MODE}' === '+'?'<=':'>=' ) + '{FINAL};{VAR}{MODE}={ADD}){{STATEMENTS}}'",
				eval: true,
				tags: ["control", "advanced"]
			}, {
				type: "statement-input",
				name: "switchAdvanced",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-root",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "72840f88-a613-4981-94a5-edfa5c0213d3"
				}],
				content: [{
					type: "text",
					value: "判断变量"
				}, {
					blockInputId: "VAR",
					type: "block-input",
					acceptType: "all",
					name: "72840f88-a613-4981-94a5-edfa5c0213d3"
				}],
				code: "switch (int({VAR})) {{STATEMENTS}}",
				tags: ["control", "advanced"]
			}, {
				type: "statement-input",
				name: "case",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-root",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "如果变量值为"
				}, {
					id: "VAR",
					type: "number-input",
					value: 0
				}, {
					type: "text",
					value: "那么"
				}],
				code: "case {VAR}:{{STATEMENTS}break;}",
				tags: ["control", "advanced"]
			}, {
				type: "statement-input",
				name: "caseDefault",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-root",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "如果都不是，那么"
				}],
				code: "default:{{STATEMENTS}break;}",
				tags: ["control", "advanced"]
			}, {
				type: "statement-input",
				name: "whileAdvanced",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}, {
					type: "connector-root",
					accept: "connector-top"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "15828cfc-31af-41ce-bcb1-8c660c96f38d"
				}],
				content: [{
					type: "text",
					value: "如果"
				}, {
					blockInputId: "CONDITION",
					type: "block-input",
					acceptType: "all",
					name: "15828cfc-31af-41ce-bcb1-8c660c96f38d"
				}, {
					type: "text",
					value: "则一直循环执行"
				}],
				code: "while ({CONDITION}){{STATEMENTS}}",
				tags: ["control", "advanced"]
			}, {
				type: "statement",
				name: "continue",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "开始下一次循环"
				}],
				code: "continue;",
				tags: ["control", "advanced"]
			}, {
				type: "statement",
				name: "break",
				connectors: [{
					type: "connector-top",
					accept: "connector-bottom"
				}, {
					type: "connector-bottom",
					accept: "connector-top"
				}],
				content: [{
					type: "text",
					value: "结束本轮循环"
				}],
				code: "break;",
				tags: ["control", "advanced"]
			}, {
				type: "output",
				name: "boolean",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					id: "STATE",
					type: "static-select",
					options: [{
						label: "True",
						value: "true"
					}, {
						label: "False",
						value: "false"
					}]
				}],
				code: "{STATE}",
				returnType: {
					type: "simple",
					value: "bool"
				},
				tags: ["logic"]
			}, {
				type: "output",
				name: "boolArray",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}],
				content: [{
					type: "text",
					value: "大小为"
				}, {
					id: "VALUE",
					type: "number-input",
					value: 0
				}, {
					type: "text",
					value: "的布尔数组"
				}],
				code: "(bool *)malloc({VALUE}*sizeof(bool))",
				returnType: {
					type: "simple",
					value: "bool *"
				},
				tags: ["logic"]
			}, {
				type: "output",
				name: "not",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "9f07b94b-133e-4172-a6b9-0d4426e80a71"
				}],
				content: [{
					type: "text",
					value: "非"
				}, {
					blockInputId: "CONDITION",
					type: "block-input",
					acceptType: "all",
					name: "9f07b94b-133e-4172-a6b9-0d4426e80a71"
				}],
				code: "!{CONDITION}",
				returnType: {
					type: "simple",
					value: "bool"
				},
				tags: ["logic"]
			}, {
				type: "output",
				name: "equalityOperations",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "45df525f-c5f8-4378-be11-21e53c913d7b"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "bb79d863-80a5-48aa-902f-daa72c5ffe0e"
				}],
				content: [{
					blockInputId: "ARG1",
					type: "block-input",
					acceptType: "all",
					name: "45df525f-c5f8-4378-be11-21e53c913d7b"
				}, {
					id: "OPERATOR",
					type: "static-select",
					options: [{
						label: "=",
						value: "=="
					}, {
						label: "!=",
						value: "!="
					}, {
						label: ">",
						value: ">"
					}, {
						label: ">=",
						value: ">="
					}, {
						label: "<",
						value: "<"
					}, {
						label: "<=",
						value: "<="
					}]
				}, {
					blockInputId: "ARG2",
					type: "block-input",
					acceptType: "all",
					name: "bb79d863-80a5-48aa-902f-daa72c5ffe0e"
				}],
				code: "{ARG1} {OPERATOR} {ARG2}",
				returnType: {
					type: "simple",
					value: "bool"
				},
				tags: ["logic"]
			}, {
				type: "output",
				name: "logicOperations",
				connectors: [{
					type: "connector-output",
					accept: "connector-input"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "db2684c7-f6ea-4e41-8376-a43e112857d8"
				}, {
					type: "connector-input",
					accept: "connector-output",
					acceptType: "all",
					name: "591531ad-b0e8-408f-b16d-7e765cb5d842"
				}],
				content: [{
					blockInputId: "ARG1",
					type: "block-input",
					acceptType: "all",
					name: "db2684c7-f6ea-4e41-8376-a43e112857d8"
				}, {
					id: "OPERATOR",
					type: "static-select",
					options: [{
						label: "且",
						value: "&&"
					}, {
						label: "或",
						value: "||"
					}]
				}, {
					blockInputId: "ARG2",
					type: "block-input",
					acceptType: "all",
					name: "591531ad-b0e8-408f-b16d-7e765cb5d842"
				}],
				code: "{ARG1} {OPERATOR} {ARG2}",
				returnType: {
					type: "simple",
					value: "bool"
				},
				tags: ["logic"]
			}]
		}
	};

	var prefix = "assets/image/hardware/";
	schema.hardware.boards.forEach(function(board) {
		board.imageUrl = prefix + "board/" + board.name + ".png";
	});

	schema.hardware.components.forEach(function(component) {
		component.imageUrl = prefix + "component/" + component.name + ".png";
	});

	return schema;
});