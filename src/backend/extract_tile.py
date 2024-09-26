from flask import Flask, send_file, request

openslide_path = 'C:/Users/16693/Downloads/openslide-bin-4.0.0.3-windows-x64/bin'
import os
if hasattr(os, 'add_dll_directory'):
    # Windows
    with os.add_dll_directory(openslide_path):
        import openslide # type: ignore
else:
    import openslide # type: ignore

import io
from PIL import Image

app = Flask(__name__)

@app.route('/tile', methods=['GET'])
def get_tile():
    image_id = request.args.get('image_id')
    level = int(request.args.get('level'))
    x = int(request.args.get('x'))
    y = int(request.args.get('y'))

    # Path to the SVS image
    # NEED to change it so that it downloads the file from the server
    image_path = f'/Users/16693/OneDrive - purdue.edu/Desktop/hist-viewer/samples/{image_id}'
    
    # Open the SVS file
    slide = openslide.OpenSlide(image_path)

    # Set tile size (256x256)
    tile_size = 256
    
    # Extract the region (tile)
    region = slide.read_region((x * tile_size, y * tile_size), level, (tile_size, tile_size))

    # Convert to JPEG
    img_byte_arr = io.BytesIO()
    region.convert('RGB').save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)
    
    # Return the tile as a response
    return send_file(img_byte_arr, mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
