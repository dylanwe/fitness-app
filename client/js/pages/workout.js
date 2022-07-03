const startTime = new Date();

/**
 * get the time and update the html to display it
 */
const timer = () => {
	const elapsed = new Date(new Date() - startTime);
	const [hours, minutes, seconds] = [
		elapsed.getHours(),
		elapsed.getMinutes(),
		elapsed.getSeconds(),
	];

	/**
	 * add a zero to the string if it's lower than 10
	 *
	 * @param {number} number the given time measurement
	 * @returns {string} a number + a 0 if it's lower than 10
	 */
	const addZero = (number) => {
		return number < 10
			? `0${number.toLocaleString()}`
			: number.toLocaleString();
	};

	/**
	 * create and return the time in propper format
	 *
	 * @returns {string} the time displayed in format HH:MM:SS
	 */
	const getDisplay = () => {
		if (hours !== 0) {
			return `${addZero(minutes)}:${addZero(seconds)}`;
		}

		return `${addZero(hours)}:${addZero(minutes)}:${addZero(seconds)}`;
	};

	document.querySelector('[data-time]').innerText = getDisplay();
};

setInterval(() => {
	timer();
}, 1000);

/**
 * Collect the data of the workout form
 *
 * @returns all exercises with its sets
 */
 const getFormData = () => {
	let data = [];
    
	document.querySelectorAll('[data-exercise-id]').forEach((exceresise) => {
		const id = parseInt(exceresise.getAttribute('data-exercise-id'));
		
		exceresise.querySelectorAll('[data-set]').forEach((set) => {
			if (set.querySelector('input[name="completed"]').checked) {
				const setData = {
					exerciseId: id,
					weight: parseInt(
						set.querySelector('input[name="weight"]').value
					),
					reps: parseInt(
						set.querySelector('input[name="reps"]').value
					),
				};

				data.push(setData);
			}
		});
	});

	return data;
};

/**
 * Store the workout in the database
 * 
 * @param {Array} sets the sets of the workout you want to post
 */
const postWorkout = async (sets) => {
	const resp = await fetch('http://localhost:3000/dashboard/workout', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ sets }),
	});

	if (resp.status === 200) {
		window.location.replace('/dashboard');
	}
};

document
	.querySelector('[data-complete]')
	.addEventListener('click', async () => {
		const workout = getFormData();

		if (!workout.length == 0) {
			await postWorkout(workout);
		}
	});