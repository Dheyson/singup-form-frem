const validationState = new Set();
const form = document.forms[0];

function validateForm(inputProps) {
	const inputName = inputProps.name;
	const verifyInputName = {
		'firstname': validationRules().firstname,
		'lastname': validationRules().lastname,
		'email': validationRules().email,
		'password': validationRules().password,
	};

	return verifyInputName[inputName](inputProps);
}

// Collection of functions for managing state
function manageState() {
	return {
		addToState: (inputData) => {
			const action = 'removeClass';
			const { inputProps, inputName } = inputData;

			validationState.add(inputName);
			manipulateValidationMsg({ inputProps, action });
		},
		removeFromState: (inputData) => {
			const action = 'addClass';
			const { inputProps, inputName } = inputData;

			validationState.delete(inputName);
			manipulateValidationMsg({ inputProps, action })
		},
		validateState: () => {
			if (validationState.size > 0) {
				return false;
			}

			if (validationState.size === 0) {
				validationRules().emptyFields();
				return true;
			}
		}
	}
};

function submitForm() {
	const submitButton = document.getElementsByClassName('js-submit-form')[0];
	submitButton.addEventListener('click', function (e) {
		e.preventDefault();
		manageState().validateState();
	});
}

function attachKeyUpForm() {
	form.addEventListener('keyup', function (e) {
		const nodeName = e.target.nodeName;
		const inputProps = e.target;

		if (nodeName == 'INPUT') {
			validateForm(inputProps);
		}
	});
}

function init() {
	attachKeyUpForm();
	submitForm();
}

document.addEventListener('DOMContentLoaded', init);
