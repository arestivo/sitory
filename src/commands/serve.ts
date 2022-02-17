import handler from 'serve-handler'
import http from 'http'

export function serve(port: number) {
  const server = http.createServer((request, response) => {
    return handler(request, response, { public: 'public' })
  })
  
  server.listen(port, () => {
    console.log('Server started at http://localhost:' + port);
  })
}