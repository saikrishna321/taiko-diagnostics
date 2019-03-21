let _screen;
let _overlay;
let frameCount = 0;
import fs from 'fs';
import { log } from './helpers' ;
import { spawn } from 'child_process'
var appRoot = require('app-root-path');
const interactionStartTime = Date.now();
const FFMPEG_PATH = '/usr/local/bin/ffmpeg';
class ScreenRecorder {

    constructor(page, overlay, dom) {
        _screen = page;
        _overlay = overlay;
        Promise.all([_screen.enable(), dom.enable(), _overlay.enable()]);
    }

    async startScreenRecord() {
        if (!fs.existsSync(appRoot.path + '/tmp')) fs.mkdirSync(appRoot.path + '/tmp');
        await _screen.screencastFrame(async frame => {
            let session =  await frame.sessionId;
            await _screen.screencastFrameAck({ sessionId: session });
            let file = appRoot.path + `/tmp/frame${String(frameCount).padStart(5, '0')}.jpeg`;
            await fs.writeFileSync(file, frame.data, 'base64');
            frameCount++;
        });
        await _screen.startScreencast({ format: 'jpeg', quality: 100,
            everyNthFrame: 3 });
        log('ScreenCast has Started!!')
    }

    async stopScreenRecord() {
        await _screen.stopScreencast();
        log('ScreenCast has stopped!!')
        log(`Interaction took ${Date.now() - interactionStartTime}ms to finish.`)
        //await renderVideo();
    }
}

const renderVideo = async () => {
    let videoFrameRate = 5;
    let videoFrameSize = '848x640';
    await new Promise((resolve, reject) => {
        const args = [
            '-y',
            '-loglevel',
            'warning', // 'debug',
            '-f',
            'image2',
            '-framerate',
            `${videoFrameRate}`,
            '-pattern_type',
            'glob',
            '-i',
            '/tmp/frame**.jpeg',
            // '-r',
            '-s',
            `${videoFrameSize}`,
            '-c:v',
            'libx264',
            '-pix_fmt',
            'yuv420p',
            '/tmp/video.mp4',
        ]

        log('spawning ffmpeg with args', FFMPEG_PATH, args.join(' '))

        const ffmpeg = spawn(FFMPEG_PATH, args, { cwd: '/tmp', shell: true })
        ffmpeg.on('message', msg => log('ffmpeg message', msg))
        ffmpeg.on('error', msg => log('ffmpeg error', msg) && reject(msg))
        ffmpeg.on('close', (status) => {
            if (status !== 0) {
                log('ffmpeg closed with status', status)
                return reject(new Error(`ffmpeg closed with status ${status}`))
            }

            return resolve()
        })

        ffmpeg.stdout.on('data', (data) => {
            log(`ffmpeg stdout: ${data}`)
        })

        ffmpeg.stderr.on('data', (data) => {
            log(`ffmpeg stderr: ${data}`)
        })
    })

    // @TODO: no sync-y syncface sync
    return fs.readFileSync('/tmp/video.mp4', { encoding: 'base64' })
}

export default ScreenRecorder;