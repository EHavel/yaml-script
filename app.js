var fs = require('fs');
const yaml = require('js-yaml');

function getFilesByDirectory(dirname) {
    return new Promise((resolve, reject) => {
        fs.readdir(dirname, (err, filenames) => {
            if (err) reject(err)

            resolve(filenames)
        });
    })
}

function getYamlContentFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, content) => {
            if (err) reject(err)

            const yamlContent = yaml.load(content);
            resolve(yamlContent)
        });
    })
}

function writeYamlFile(content, path, filename) {
    let yamlStr = yaml.dump(content);
    fs.writeFileSync(path + filename, yamlStr, 'utf8');
}

async function init() {
    console.log("Executando...")

    const dir = 'docs/'

    console.log('Lendo diretório', dir)
    const filenames = await getFilesByDirectory(dir)
    console.log(filenames)

    console.log('Lendo arquivo base')
    const base = await getYamlContentFile('base.yml')

    for await (let filename of filenames) {
        console.log('Lendo arquivo', dir + filename)
        const content = await getYamlContentFile(dir + filename)
        base.tags.push(...content.tags)
        base.paths = Object.assign(base.paths, content.paths)
        base.definitions = Object.assign(base.definitions, content.definitions)
    }


    console.log('Escrevendo yaml final...')
    writeYamlFile(base, '', 'data-out.yaml')

    console.log("Fim da execução...")

}
init()

// try {
//     let fileContents = fs.readFileSync('./base.yml', 'utf8');
//     let data = yaml.load(fileContents);
//     data.tags = []
//     data.paths = []

//     readFiles('docs/', (filename, content) => {
//         const doc = yaml.load(content);

//         data.tags.push(...doc.tags)
//         // console.log("data", data);

//         // data.paths.push(...doc.paths)
//         // console.log("");
//         // console.log(filename, doc.paths);
//     }, (err) => {
//         throw err;
//     });

//     console.log("");
//     console.log("data", data);
// } catch (e) {
//     console.log(e);
// }

