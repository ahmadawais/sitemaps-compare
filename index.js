#!/usr/bin/env node

/**
 * sitemaps-compare
 * Compare two sitemaps by converting them to files with URLs and VSCode
 *
 * @author Ahmad Awais <https://twitter.com/MrAhmadAwais/>
 */
const getLinks = require('sitemap-links');
var shell = require('shelljs');
const ora = require('ora');
const spinner = ora({ text: '' });
const { green: g, yellow: y, dim: d } = require('chalk');
const alert = require('cli-alerts');

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const ask = require('./utils/ask');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	if (input.includes(`rm`)) {
		shell.rm(`-rf`, `./new.md`);
		shell.rm(`-rf`, `./old.md`);
		alert({
			type: `success`,
			name: `REMOVED`,
			msg: `all the generated new.md and old.md files from pwd.`
		});
		process.exit(0);
	}

	const oldSitemapLink = await ask({ message: `OLD Sitemap` });
	const newSitemapLink = await ask({ message: `NEW Sitemap` });

	const newLinks = await getLinks(newSitemapLink);
	const oldLinks = await getLinks(oldSitemapLink);

	newLinks.sort();
	oldLinks.sort();

	spinner.start(`${y(`Generating`)}`);
	await shell.ShellString(oldLinks.join('\n')).to('old.md');
	await shell.ShellString(newLinks.join('\n')).to('new.md');
	spinner.succeed(`${g(`./old.md`)} and ${g(`./new.md`)} created with links`);

	alert({
		type: `success`,
		name: `DONE`,
		msg: `Run the following command in the terminal to diff.

		${d(`code old.md new.md --diff`)}
		`
	});

	debug && log(flags);
})();
