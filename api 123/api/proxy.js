const fetch = require('node-fetch')

exports.handler = async (event, context) => {
	const { path, httpMethod, headers, body } = event

	// Удаляем префикс /journal/api из пути
	const targetPath = path.replace('/journal/api', '/api')

	// Базовый URL внешнего API
	const baseUrl = 'https://msapi.top-academy.ru'

	try {
		// Формируем конечный URL для запроса
		const targetUrl = `${baseUrl}${targetPath}`

		// Прокси запрос
		const response = await fetch(targetUrl, {
			method: httpMethod,
			headers: {
				...headers,
				host: undefined, // Удаляем хедер host, чтобы избежать конфликтов
			},
			body: httpMethod === 'GET' || httpMethod === 'HEAD' ? undefined : body,
		})

		const responseData = await response.text() // Получаем текст ответа

		return {
			statusCode: response.status,
			body: responseData,
			headers: {
				'Content-Type': response.headers.get('Content-Type') || 'text/plain',
			},
		}
	} catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({
				error: 'Ошибка проксирования',
				details: error.message,
			}),
		}
	}
}
