md5 = require('md5')

module.exports = (app) ->

	addInfo = (log) ->
		log.setNull 'url', params.url, (err) ->
			return next() if err

			log.increment "c", (err) ->
				return next() if err

				log.setNull 'd', [], (err) ->
					return next() if err

					d = log.get('d')

					# something went wrong? this should return at least an empty array
					return next() if !d

					if !d.length
						date = new Date()
						log.push 'd', { d: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(), c: 1 }, next
					else
						log.increment "d.#{d.length - 1}.c", next


	app.get '*', (page, model, params, next) ->
		if process?.env?.DEBUG
			console.log params?.url + " - " + page?.req?.headers?['user-agent']

		if !params?.url
			next()
		else
			log = model.at "k_logs.#{md5(params.url)}"
			log.subscribe (err) ->
				if err
					next()
				else if !log.get()
					model.add "k_logs", { id: md5(params.url) }, ->
						addInfo log
				else
					addInfo log


