const { Input } = require('enquirer');
const to = require('await-to-js').default;
const shouldCancel = require('cli-should-cancel');
const handleError = require('cli-handle-error');

module.exports = async ({ message, initial, hint }) => {
	const [err, response] = await to(
		new Input({
			message,
			initial,
			hint,
			validate(value) {
				return !value ? `Please add a value.` : true;
			}
		})
			.on(`cancel`, () => shouldCancel())
			.run()
	);

	handleError(`INPUT: `, err);
	return response;
};
