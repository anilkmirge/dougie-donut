const buttons = document.querySelectorAll('.js-button');

for (let i = 0; i < buttons.length; i++) {
	buttons[i].addEventListener('click', function (evt) {
		evt.preventDefault();
		let divElt = document.querySelector('#main');
		divElt.innerHTML = '';
		const loaderDiv = document.createElement('div');
		loaderDiv.classList.add('loader');
		divElt.appendChild(loaderDiv);
		let loadText = document.createTextNode('Fetching data, please wait...');
		divElt.appendChild(loadText);
		const borough = evt.currentTarget.value.toUpperCase();
		const inputValue = document.querySelector('#numOfComplaints').value;
		let limit = 10; //default if input text is empty
		const agency = 'NYPD';
		if (!inputValue || isNaN(inputValue)) {
			divElt.innerHTML = '';
			console.log('Bad input! Please enter a valid positive number');
			alert('Bad input! Please enter a valid positive number');
		} else {
			limit = inputValue;
			const url = `https://data.cityofnewyork.us/resource/erm2-nwe9.json?borough=${borough}&$limit=${limit}&agency=${agency}&$order=descriptor ASC`;
			fetch(url)
				.then((res) => {
					return res.json();
				})
				.then((res) => {
					console.log('success!', res);
					divElt.innerHTML = '';
					if (res && res.length > 0) {
						const uElt = document.createElement('ul');
						let catMap = new Map();
						for (let i = 0; i < res.length; i++) {
							const currentResponse = res[i];
							const liElt = document.createElement('li');
							liElt.innerText = currentResponse.descriptor;
							if (catMap.has(currentResponse.complaint_type)) {
								catMap.set(
									currentResponse.complaint_type,
									catMap.get(currentResponse.complaint_type) + 1
								);
							} else {
								catMap.set(currentResponse.complaint_type, 1);
							}
							let button = document.createElement('BUTTON');
							let text = document.createTextNode('What did the police do?');
							// appending text to button
							button.appendChild(text);
							button.classList.add('police-response');
							button.addEventListener('click', function (event) {
								event.preventDefault();
								const p = document.querySelector('#policeResponse');
								if (liElt.contains(p)) {
									//removeChild
									liElt.removeChild(p);
								} else {
									//appendChild
									const paragraph = document.createElement('p');
									paragraph.setAttribute('id', 'policeResponse');
									paragraph.innerText = currentResponse.resolution_description
										? currentResponse.resolution_description
										: 'Not provided';
									liElt.appendChild(paragraph);
								}
							});
							liElt.appendChild(button);
							uElt.appendChild(liElt);
						}
						divElt.appendChild(uElt);
						const divEltCat = document.querySelector('#responseCategories');
						divEltCat.innerHTML = '';
						for (let [k, v] of catMap) {
							const pElt = document.createElement('p');
							pElt.innerText = `${k} was complained about ${v} times`;
							divEltCat.appendChild(pElt);
						}
					}
				})
				.catch((err) => {
					console.log('something went wrong...', err);
				});
		}
	});
}
