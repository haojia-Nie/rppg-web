import * as tf from '@tensorflow/tfjs';

export class TSM extends tf.layers.Layer {

	constructor(config) {
		super(config);
	}

	computeOutputShape(inputShape) {
		/* eslint-disable no-console */
		//console.log(inputShape);
		return inputShape;
	}

	call(inputs) {
		var input = inputs[0];
		let nt, h, w, c;
		// eslint-disable-next-line
		let out, out1, out2, out3, empty;
		let padding1, padding2;
		nt = input.shape[0]; // 20
		h = input.shape[1];
		w = input.shape[2];
		c = input.shape[3];
		
		const fold_div = 3;
		const fold = Math.floor(c / fold_div);
		const last_fold = c - (fold_div - 1) * fold;
		input = tf.reshape(input, [-1, nt, h, w, c]);
		[out1, out2, out3] = tf.split(input, [fold, fold, last_fold], -1)

		// Shift left
		padding1 = tf.zeros([out1.shape[0], 1, out1.shape[2], out1.shape[3], fold]);	
		[empty, out1] = tf.split(out1, [1, nt - 1], 1);
		out1 = tf.concat([out1, padding1], 1);

		// Shift right
		padding2 = tf.zeros([out2.shape[0], 1, out2.shape[2], out2.shape[3], fold]);
		[out2, empty] = tf.split(out2, [nt - 1, 1], 1);
		out2 = tf.concat([padding2, out2], 1);

		out = tf.concat([out1, out2, out3], -1);
		out = tf.reshape(out, [-1, h, w, c]);

		return out;
	}

	getConfig() {
		const config = super.getConfig();
		return config;
	}

	static getClassName() {
		return 'TSM';
	}
	
}

TSM.className = 'TSM'; // static variable
