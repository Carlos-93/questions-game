const jsConfetti = new JSConfetti()

document.addEventListener("DOMContentLoaded", () => {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            let questions = data.questions.sort(() => Math.random() - 0.5);
            const mainContainer = document.querySelector(".container-questions");
            let currentQuestionIndex = 0;

            function resetGame() {
                currentQuestionIndex = 0;
                questions = questions.sort(() => Math.random() - 0.5);
                mainContainer.innerHTML = "";
                loadQuestions(currentQuestionIndex, 2);
            }

            function loadQuestions(start, count) {
                for (let i = start; i < start + count && i < questions.length; i++) {
                    const question = questions[i];
                    question.response = question.response.sort(() => Math.random() - 0.5);

                    const div = document.createElement("div");
                    const h2 = document.createElement("h2");
                    h2.textContent = question.text;
                    const img = document.createElement("img");
                    img.src = question.image;
                    div.appendChild(h2);
                    div.appendChild(img);

                    question.response.forEach((resp, respIndex) => {
                        const input = document.createElement("input");
                        const label = document.createElement("label");
                        input.type = "radio";
                        input.name = "question" + i;
                        input.value = resp;
                        input.id = "question" + i + "-response" + respIndex;
                        label.setAttribute('for', "question" + i + "-response" + respIndex);
                        label.textContent = resp;
                        label.id = "label-" + input.id;
                        div.appendChild(input);
                        div.appendChild(label);
                    });
                    mainContainer.appendChild(div);
                }
            }
            loadQuestions(currentQuestionIndex, 2);

            document.getElementById("buttonCheck").addEventListener("click", () => {
                let correctResponses = 0;
                let incorrectResponses = 0;

                for (let i = currentQuestionIndex; i < currentQuestionIndex + 2; i++) {
                    const question = questions[i];
                    const selectedInput = document.querySelector('input[name="question' + i + '"]:checked');
                    const questionDiv = selectedInput ? selectedInput.closest("div") : null;

                    if (selectedInput) {
                        const correspondingLabel = document.getElementById("label-" + selectedInput.id);
                        
                        if (selectedInput.value === question.correctResponse) {
                            correctResponses++;
                            correspondingLabel.classList.add("correct-response");
                            document.querySelectorAll('input[name="question' + i + '"]').forEach((input) => {
                                input.disabled = true;
                                document.querySelectorAll('label[for="' + input.id + '"]').forEach((label) => {
                                    label.style.pointerEvents = "none";
                                });
                            });
                            if (questionDiv) {
                                questionDiv.classList.add("disabled-question");
                            }
                        } else {
                            incorrectResponses++;
                            correspondingLabel.classList.add("incorrect-response");
                            document.querySelectorAll('input[name="question' + i + '"]').forEach((input) => {
                                input.disabled = true;
                                document.querySelectorAll('label[for="' + input.id + '"]').forEach((label) => {
                                    label.style.pointerEvents = "none";
                                });
                            });
                            if (questionDiv) {
                                questionDiv.classList.add("disabled-question");
                            }
                        }
                    }
                }
                const alertDiv = document.querySelector('.alert');

                switch (true) {
                    case (correctResponses === 2 && currentQuestionIndex + 2 < questions.length):
                        alertDiv.textContent = "¡Bien hecho! Siguiente ronda";
                        alertDiv.classList.add("alert-winner");
                        currentQuestionIndex += 2;
                        loadQuestions(currentQuestionIndex, 2);
                        document.getElementById("buttonCheck").scrollIntoView({ behavior: "smooth" });
                        break;
                        
                    case (correctResponses === 2 && currentQuestionIndex + 2 >= questions.length):
                        alertDiv.textContent = "¡Has acertado todas las preguntas, has ganado el concurso!";
                        alertDiv.classList.add("alert-winner");
                        jsConfetti.addConfetti()
                        setTimeout(() => {
                            resetGame();
                        }, 3000);
                        break;
                        
                    case (incorrectResponses === 1):
                        alertDiv.textContent = "Has fallado la pregunta, vuelvelo a intentarlo";
                        alertDiv.classList.add("alert-loser");
                        setTimeout(() => {
                            resetGame();
                        }, 3000);
                        break;
                        
                    case (incorrectResponses === 0 && correctResponses === 0):
                        alertDiv.textContent = "No has respondido a ninguna pregunta";
                        alertDiv.classList.add("alert-loser");
                        break;
                }
                setTimeout(() => {
                    alertDiv.textContent = "";
                    alertDiv.classList.remove("alert-winner", "alert-loser");
                }, 3000);
            });
        });
});
