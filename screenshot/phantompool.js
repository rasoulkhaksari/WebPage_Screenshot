const createPhantomPool = require('phantom-pool')
const { v4: uuidv4 } = require('uuid');
const { connect, StringCodec } = require('nats');
const nats_servers = { servers: "localhost:4222" };
const channel = "webcapture";

const pool = createPhantomPool({
    max: 10, // default
    min: 2, // default
    // how long a resource can stay idle in pool before being removed
    idleTimeoutMillis: 30000, // default.
    // maximum number of times an individual resource can be reused before being destroyed; set to 0 to disable
    maxUses: 50, // default
    // function to validate an instance prior to use; see https://github.com/coopernurse/node-pool#createpool
    validator: () => Promise.resolve(true), // defaults to always resolving true
    // validate resource before borrowing; required for `maxUses and `validator`
    testOnBorrow: true, // default
    // For all opts, see opts at https://github.com/coopernurse/node-pool#createpool
    phantomArgs: [['--ignore-ssl-errors=true', '--disk-cache=true'], {
        logLevel: 'error',
    }], // arguments passed to phantomjs-node directly, default is `[]`. For all opts, see https://github.com/amir20/phantomjs-node#phantom-object-api
});

(async () => {
    const sc = StringCodec();
    const nc = await connect(nats_servers);
    const sub = nc.subscribe(channel, { queue: "workers" });
    for await (const m of sub) {
        console.time('CAPTURE')
        pool.use(async (instance) => {
            const page = await instance.createPage()
            await page.property('viewportSize', { width: 1024, height: 768 });
            await page.property('clipRect', { top: 0, left: 0, width: 1024, height: 768 });
            const status = await page.open(sc.decode(m.data), { operation: 'GET' })
            if (status !== 'success') {
                throw new Error('cannot open web page')
            }
            await page.render(`${__dirname}/../result/${uuidv4()}.jpg`, { format: 'jpeg', quality: '70' });
            return true;
        }).then((done) => {
        });
        console.timeEnd('CAPTURE')
        m.respond(sc.encode("1"));
    }
    await nc.close();
})();
