window.onload = function () {
  const month = document.querySelector(".month");
  const weekDays = document.querySelector(".daysOfWeek");
  const days = document.querySelector(".days");
  const back = document.querySelector("#back")
  const forward = document.querySelector("#forward")

  // Stores the value of the current date and time
  let date = new Date();
  console.log(date)

  async function generateKey() {
    // Uses Browsers Cryptographic Implementation to generate a key
    return await crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256
      },
      // Allow Export
      true,
      // restrict key operations to encrypt and decrypt
      ["encrypt", "decrypt"]
    );
  }


  async function encryptData(key, message) {
    // Allows string encoding using UTF-8
    const encoder = new TextEncoder();
    // Encodes the message to be sent
    const data = encoder.encode(message);

    // Generate a random 96-bit IV for each encryption
    // Ensures encrypting the data multipletimes produces a different ciphertext each time
    const iv = crypto.getRandomValues(
      new Uint8Array(12)
    );
    // Encrypts the data and key Utilizing AES encryption
    const encrypted = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      data
    );

    // returns a ciphertext alongside its corresponding iv value
    return {
      iv: Array.from(iv),
      ciphertext: Array.from(new Uint8Array(encrypted))
    };
  }


  async function decryptData(key, encryptedData) {
    // Retrieve the Intizalized Vector and ciperText from encryptedData for decryption
    const iv = Uint8Array(encryptData.iv);
    const cipertext = new Uint8Array(encryptedData.ciphertext);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      cipertext
    );
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }





  function renderCalendar() {
    const current_year = date.getFullYear();
    // Months is count from 0 and Weekdays aswell
    // Days are counted from 1
    const current_month = date.getMonth();

    // Gets the first day of any given Month as a week day
    const firstDay = new Date(current_year, current_month, 1).getDay();
    // Returns the last day of any given month as a date
    // current_month + 1 returns the month ahead of the current month
    // 0 read the previous day before the first day of that month therefore Nov 1,2026 as the moth then will give the day 31 of October
    const lastDate = new Date(current_year, current_month + 1, 0).getDate();
    // Note First Day is 4 as they  start counting weekdays from 0
    console.log(current_year, current_month, firstDay, lastDate);
    days.innerHTML = ""
    // Changes the Month Inner Text to the current Date month in its long format with the year beside it while adjusting based on default browser/device language
    month.innerText = `${date.toLocaleString("default", { month: "long" })} ${date.toLocaleString("default", { year: "numeric" })}`
    // Loops through all the days that do not start the first day of any given month and create empty div tags that are blank as placeholders
    for (let i = 0; i < firstDay; i++) {
      days.innerHTML += '<div class="empty"></div>'
    }
    // Loops through each day until it reaches the last day of the month
    for (let d = 1; d <= lastDate; d++) {
      const today = new Date();
      // Add each day incrementing from 1 to the last day of that month and verify if the day is the current day and give it a class of today
      const isToday = d === today.getDate() && current_year === today.getFullYear() && current_month === today.getMonth()
      days.innerHTML += `<div class=" ${isToday ? "today" : ""}">${d}</div>`
      console.log(isToday)
    }
  }
  back.addEventListener("click", (event) => {
    event.preventDefault();
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
  })

  forward.addEventListener("click", (event) => {
    event.preventDefault();
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
  })

  renderCalendar();
}