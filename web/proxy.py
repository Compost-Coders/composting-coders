#!/usr/bin/env python3
"""Simple CORS proxy for LM Studio"""
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.request
import urllib.error
import threading

class ProxyHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        """Relay POST requests to LM Studio"""
        if self.path == '/shutdown':
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'shutting down the server'}).encode())
            threading.Thread(target=self.server.shutdown).start()
            return

        if self.path == '/v1/chat/completions':
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(content_length)
                
                # Forward to LM Studio
                req = urllib.request.Request(
                    'http://127.0.0.1:1234/v1/chat/completions',
                    data=body,
                    headers={'Content-Type': 'application/json'}
                )
                
                with urllib.request.urlopen(req) as response:
                    response_data = response.read()
                
                # Send response with CORS headers
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(response_data)
                
            except urllib.error.URLError as e:
                self.send_response(502)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                error_msg = {'error': f'Could not reach LM Studio: {str(e)}'}
                self.wfile.write(json.dumps(error_msg).encode())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                error_msg = {'error': str(e)}
                self.wfile.write(json.dumps(error_msg).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        """Suppress logging"""
        pass

if __name__ == '__main__':
    server = HTTPServer(('127.0.0.1', 5000), ProxyHandler)
    print('Proxy server running on http://127.0.0.1:5000')
    print('Forwarding to LM Studio at http://127.0.0.1:1234')
    print('Press Q + Enter to shut down the server')

    server_thread = threading.Thread(target=server.serve_forever)
    server_thread.daemon = True
    server_thread.start()

    while True:
        try:
            key = input()
            if key.strip().lower() == 'q':
                print('Shutting down the server...')
                server.shutdown()
                break
        except (KeyboardInterrupt, EOFError):
            print('\nShutting down the server...')
            server.shutdown()
            break
