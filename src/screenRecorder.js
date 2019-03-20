let screen;
let frameCount = 0;
import fs from 'fs';

class ScreenRecorder {

    constructor(client) {
        screen = client;
        Promise.all([screen.enable()]);
    }

    async startScreenRecord() {
        await screen.screencastFrame(async frame => {
            let session =  await frame.sessionId;
            await screen.screencastFrameAck({ sessionId: session });
            await fs.writeFileSync(`frame${String(frameCount).padStart(5, '0')}.jpeg`, frame.data, 'base64');
            frameCount++;
        });
        await screen.startScreencast({ format: 'jpeg', quality: 100,
            everyNthFrame: 3 });
    }

    async stopScreenRecord() {
        await screen.stopScreencast();
    }
}

export default ScreenRecorder;