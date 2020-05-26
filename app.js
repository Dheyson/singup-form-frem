const validationState = new Set();
const form = document.forms[0];

// Function manipulates validation messages by toggling them
function manipulateValidationMsg(validationData) {
	const { inputProps, action } = validationData;
	const elementValidationMsg = inputProps.nextElementSibling;
	const validationMsgClasses = elementValidationMsg.classList;
	const inputClass = inputProps.classList;

	const removeClass = () => {
		validationMsgClasses.remove('hide');
		inputClass.remove('error-input')
	};

	const addClass = () => {
		validationMsgClasses.add('hide');
		inputClass.add('error-input');
	};

	return action === 'hide' ? addClass() : removeClass();
}

// Validation rules for each field in our form.
function validationRules() {
	return {
		firstname: (inputProps) => {
			const usernameValidationRule = /[A-Za-z]/;
			const inputValue = inputProps.value;
			const inputName = inputProps.name;
			const isInputValid = usernameValidationRule.test(inputValue);

			isInputValid ? manageState().removeFromState({ inputProps, inputName }) : manageState().addToState({ inputProps, inputName });

			return true;
		},

		lastname: (inputProps) => {
			const usernameValidationRule = /[A-Za-z]/;
			const inputValue = inputProps.value;
			const inputName = inputProps.name;
			const isInputValid = usernameValidationRule.test(inputValue);

			isInputValid ? manageState().removeFromState({ inputProps, inputName }) : manageState().addToState({ inputProps, inputName });

			return true;
		},

		email: (inputProps) => {
			const usernameValidationRule = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			const inputValue = inputProps.value;
			const inputName = inputProps.name;
			const isInputValid = usernameValidationRule.test(inputValue);

			isInputValid ? manageState().removeFromState({ inputProps, inputName }) : manageState().addToState({ inputProps, inputName });

			return true;
		},

		password: (inputProps) => {
			const passwordValidationRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/g;
			const inputValue = inputProps.value;
			const inputName = inputProps.name;
			const isInputValid = passwordValidationRule.test(inputValue);

			isInputValid ? manageState().removeFromState({ inputProps, inputName }) : manageState().addToState({ inputProps, inputName });

			return true;
		},

		emptyFields: () => {
			const formInputElems = [...form.elements].filter(item => item.nodeName === 'INPUT');
			for (const inputProps of formInputElems) {
				const inputName = inputProps.name;
				const inputValue = inputProps.value;

				if (!inputValue) {
					manageState().addToState({ inputProps, inputName });
				}
			}
		}
	}
}

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
