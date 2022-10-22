import sys, os

import urllib.request
import requests
from dotenv import load_dotenv

load_dotenv()




def main(argv):

    if len (argv) < 3: 
        print("Pas assez de paramètre");
        print (f"{argv[0]} file.txt dir")
        sys.exit(0)

    url_file, to_dir = argv[1], argv[2]

    #
    # netcoupe login
    #

    session = requests.Session()

    session.get ('https://netcoupe.net')

    r = session.post ('https://netcoupe.net/Login.aspx', data={
        'txtBLogin': os.getenv ('NC_USERNAME'),
        'txtBPassword': os.getenv ('NC_PASSWORD'),
        'btnLogin':	"Se+connecter"
    } )



    with open (url_file,"r") as f:
        urls = f.read().splitlines()

    for url in urls:
        id = url[url.find("FileID=")+7:]
        dest_name = os.path.join (to_dir, f"trace_{id}.igc")
        
        if (os.path.isfile(dest_name)):
            print (f"Skipping {url}: file {dest_name} exists.")
            continue

        print (f"Downlad  {url} to {dest_name}")

        r = session.get (url)

        with open (dest_name, "wb") as f:
            f.write (r.content)




if __name__ == "__main__":
   #main(sys.argv)
   main (['download.py', 'urls.txt', 'IGC'])


