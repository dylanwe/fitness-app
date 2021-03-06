/**
 * Store the workout in the database
 *
 * @param workout the workout you want to post
 */
//@ts-ignore
 const postWorkout = async (workout: workoutFormData) => {
	const workoutId = document
		.querySelector('[data-workout]')!
		.getAttribute('data-workout');

	const resp = await fetch(
		`/dashboard/workout/${workoutId}`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ workout }),
		}
	);

	if (resp.status === 200) {
		window.location.replace('/dashboard');
	}
};

// save data event
document.querySelector('[data-save]')!.addEventListener('click', async () => {
	const workout = getFormData();

	if (workout.sets.length !== 0 && workout.name !== '') {
		await postWorkout(workout);
	}
});

// delete template event
document.querySelector('[data-delete]')!.addEventListener('click', async () => {
	const templateId = parseInt(document.querySelector('[data-workout]')!.getAttribute('data-workout')!);

	const resp = await fetch(
		`/dashboard/workout/${templateId}`,
		{
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);

	if (resp.status === 200) {
		window.location.replace('/dashboard');
	}
});