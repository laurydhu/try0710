import json
import requests

QUERY = '''
{
  pairs(where: {
    token0: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    token1: "0xdac17f958d2ee523a2206206994597c13d831ec7"
  }) {
    id
    token0 { symbol }
    token1 { symbol }
    reserve0
    reserve1
    token0Price
    token1Price
  }
}
'''

URL = 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange'

def main():
    response = requests.post(URL, json={'query': QUERY})
    response.raise_for_status()
    data = response.json()
    print(json.dumps(data, indent=2))

if __name__ == '__main__':
    main()
