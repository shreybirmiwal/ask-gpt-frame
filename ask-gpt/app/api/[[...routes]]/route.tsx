/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', (c) => {

  return c.res({
    image: '/1.png',
    action: '/res',
    intents: [
      <TextInput placeholder="Ask any question... (why are apples red?)" />,
      <Button value="Submit">Submit</Button>,
    ],
  })
})


app.frame('/res', async (c) => {
  const { inputText } = c;

  if (inputText === "") {
    return c.res({
      action: "/",
      image: "/blank_box.png",
      intents: [
        <Button value="Restart">Restart</Button>,
      ],
    });
  }

  const valReturn: string = await getResponse(inputText ?? "");

  if (valReturn === "An error occurred") {
    return c.res({
      action: "/",
      image: "/error.png",
      intents: [
        <Button value="Restart">Restart</Button>,
      ],
    });
  }


  console.log("AYOO !!! " + valReturn);

  return c.res({
    action: "/", //GO BACK TO START if restart button clicked
    image: (
      <div style={{ color: 'black', display: 'flex', fontSize: 30 }}>
        {valReturn ? (
          <div>
              {valReturn}
          </div>
        ) : (
          <div>Sorry, I don't know the answer to that question</div>
        )}
      </div>
    ),
    intents: [
      <Button value="Restart">Restart</Button>,
    ],
  });


});

const getResponse = async (inputText: string): Promise<string> => {

  //console.log('started get response ' + inputText)

  const APIKEY = "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"
  const APIURL = "https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions"
  

  try {
    const response = await fetch(APIURL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${APIKEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: inputText,
        max_tokens: 100,
      }),
    });

    //console.log('sent api')
    const data = await response.json();
    //.log(data)
    //console.log('API Response:', data.choices[0].text);
    return data.choices[0].text

  } catch(error) {
    console.error('API Error:', error);
    return "An error occurred"
  }
}


export const GET = handle(app)
export const POST = handle(app)
