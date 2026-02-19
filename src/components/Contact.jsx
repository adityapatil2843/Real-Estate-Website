{/**985606f4-3823-4cc6-a612-63ce25d77b6e */}

import React from 'react'
const Contact = () => {

  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "985606f4-3823-4cc6-a612-63ce25d77b6e");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("");
      alert("Form Submitted Successfully")
      event.target.reset();
    } else {
      console.log("Error", data);
      alert(data.message)
      setResult("");
    }
  };

  return (
    <div
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
      id="Contact"
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800">
        Contact <span className="font-light text-gray-500">With Us</span>
      </h1>

      <p className="text-center text-gray-500 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
        Ready to make a move? Lets Build your future together
      </p>

      <form
        onSubmit={onSubmit}
        className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6 sm:p-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col text-sm text-gray-600">
            Your Name
            <input
              className="mt-2 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
              name="Name"
              type="text"
              placeholder="Name"
              required
            />
          </div>

          <div className="flex flex-col text-sm text-gray-600">
            Your Email
            <input
              className="mt-2 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
              name="email"
              type="email"
              placeholder="Email"
              required
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col text-sm text-gray-600">
          Message
          <textarea
            name="Message"
            placeholder="message"
            required
            rows={5}
            className="mt-2 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 transition resize-none"
          ></textarea>
        </div>

        <button
          className="w-full mt-8 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
        >
          {result ? result : "Send Message"}
        </button>
      </form>
    </div>
  )
}

export default Contact
