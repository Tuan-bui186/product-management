const buttonGoBack = document.querySelectorAll("[button-go-back]");
if (buttonGoBack.length > 0) {
  buttonGoBack.forEach((button) => {
    button.addEventListener("click", () => {
      history.back();
    });
  });
}
