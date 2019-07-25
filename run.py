import os
from aitoolkit import create_app

port = int(os.environ.get('PORT', 5000))

app = create_app()
app.jinja_env.auto_reload = True
app.run(host='0.0.0.0', port=port, debug=app.debug)
#app.run(host='0.0.0.0', port=port, debug=app.debug, ssl_context='adhoc')
