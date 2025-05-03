import { useState, ReactElement, useEffect } from 'react';

const cryptos = [
  {
    name: 'Bitcoin',
    id: 'bitcoin',
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 -0.5 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M33.2538 16.1292C33.2538 25.0371 26.0329 32.2584 17.1255 32.2584C8.21799 32.2584 0.99707 25.0371 0.99707 16.1292C0.99707 7.22128 8.21799 0 17.1255 0C26.0329 0 33.2538 7.22128 33.2538 16.1292ZM21.0002 10.1366C23.2438 10.9071 24.8849 12.0607 24.5629 14.2077C24.3291 15.7799 23.4543 16.5403 22.2921 16.8065C23.8866 17.6335 24.4301 19.2029 23.9251 21.1005C22.9664 23.8314 20.6874 24.0613 17.6562 23.4905L16.9202 26.4261L15.1434 25.9844L15.8693 23.0882C15.4087 22.9742 14.9379 22.8522 14.4529 22.7221L13.724 25.6325L11.9492 25.1908L12.6842 22.2491L9.10534 21.3496L9.98817 19.3226C9.98817 19.3226 11.2982 19.6685 11.28 19.6433C11.7832 19.7673 12.0069 19.4406 12.095 19.2238L14.0895 11.256C14.1117 10.8798 13.9811 10.4059 13.2613 10.2264C13.2886 10.2072 11.9705 9.90669 11.9705 9.90669L12.4433 8.01585L16.0272 8.90026L16.7562 5.99188L18.532 6.43358L17.8182 9.28448C18.2961 9.39238 18.776 9.5023 19.2427 9.61828L19.9514 6.78553L21.7282 7.22724L21.0002 10.1366ZM16.7488 14.9882C17.9591 15.3091 20.5928 16.0074 21.0519 14.1765C21.5202 12.3033 18.9615 11.7376 17.7087 11.4606L17.7086 11.4606L17.7085 11.4606C17.5666 11.4292 17.4414 11.4015 17.3393 11.3761L16.4545 14.9117C16.5388 14.9325 16.6378 14.9588 16.7488 14.9882ZM15.3775 20.6807C16.8271 21.0626 19.9976 21.8977 20.5021 19.8803C21.0185 17.8175 17.9445 17.1305 16.4446 16.7952L16.4441 16.7951C16.2767 16.7577 16.129 16.7247 16.008 16.6946L15.032 20.5913C15.1311 20.6158 15.2472 20.6464 15.3771 20.6806L15.3775 20.6807Z"
          fill="white"
        />
      </svg>
    ),
  },
  {
    name: 'Ethereum',
    id: 'ethereum',
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12.3735 3V9.6525L17.9963 12.165L12.3735 3Z" fill="white" fillOpacity="0.602" />
        <path d="M12.3735 3L6.75 12.165L12.3735 9.6525V3Z" fill="white" />
        <path
          d="M12.3735 16.476V20.9963L18 13.212L12.3735 16.476Z"
          fill="white"
          fillOpacity="0.602"
        />
        <path d="M12.3735 20.9963V16.4753L6.75 13.212L12.3735 20.9963Z" fill="white" />
        <path
          d="M12.3735 15.4298L17.9963 12.1651L12.3735 9.65405V15.4298Z"
          fill="white"
          fillOpacity="0.2"
        />
        <path
          d="M6.75 12.1651L12.3735 15.4298V9.65405L6.75 12.1651Z"
          fill="white"
          fillOpacity="0.602"
        />
      </svg>
    ),
  },
  {
    name: 'XRP',
    id: 'ripple',
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.5 7.5L12 13L17.5 7.5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.5 16.5L12 11L17.5 16.5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

interface CryptoData {
  price: number;
  change24h: number;
}

interface CryptoWidgetIconButtonProps {
  icon: ReactElement;
  onSelect: () => void;
  isSelected: boolean;
}

const CryptoWidgetIconButton: React.FC<CryptoWidgetIconButtonProps> = ({
  icon,
  onSelect,
  isSelected,
}) => {
  return (
    <button
      onClick={onSelect}
      className={`w-16 h-16 flex items-center justify-center text-white rounded-full transition-colors ${isSelected ? 'ring-2 ring-white' : ''}`}
    >
      {icon}
    </button>
  );
};

export const CryptoWidgets: React.FC = () => {
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedCrypto) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const selectedCryptoData = cryptos.find(c => c.name === selectedCrypto);
          if (!selectedCryptoData) return;

          // Check cache first
          const cachedData = localStorage.getItem(`crypto_${selectedCryptoData.id}`);
          const cacheTime = localStorage.getItem(`crypto_${selectedCryptoData.id}_time`);
          const now = Date.now();

          // Use cache if it's less than 1 minute old
          if (cachedData && cacheTime && now - parseInt(cacheTime) < 60000) {
            setCryptoData(JSON.parse(cachedData));
            setIsLoading(false);
            return;
          }

          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCryptoData.id}&vs_currencies=usd&include_24hr_change=true`
          );
          const data = await response.json();
          const cryptoData = data[selectedCryptoData.id];
          const price = cryptoData?.usd;
          const change24h = cryptoData?.usd_24h_change;
          const newData = { price, change24h };

          // Cache the new data
          localStorage.setItem(`crypto_${selectedCryptoData.id}`, JSON.stringify(newData));
          localStorage.setItem(`crypto_${selectedCryptoData.id}_time`, now.toString());

          setCryptoData(newData);
        } catch (error) {
          console.error('Error fetching crypto data:', error);
        }
        setIsLoading(false);
      };

      fetchData();
      const interval = setInterval(fetchData, 60000); // Update every minute
      return () => clearInterval(interval);
    } else {
      setCryptoData(null);
    }
  }, [selectedCrypto]);

  console.log(cryptoData);
  return (
    <div className="fixed bottom-4 left-4 flex flex-col items-start gap-2">
      {selectedCrypto && (
        <div className="px-4 py-2 rounded-lg min-w-[200px] mb-2">
          <div className="text-white text-center">
            <div className="font-medium">{selectedCrypto}</div>
            {isLoading ? (
              <div className="text-sm text-gray-400">Loading...</div>
            ) : cryptoData ? (
              <>
                <div className="text-lg font-bold">
                  ${cryptoData.price?.toLocaleString() ?? 'N/A'}
                </div>
                <div
                  className={`text-sm ${(cryptoData.change24h ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}
                >
                  {(cryptoData.change24h ?? 0) >= 0 ? '+' : ''}
                  {cryptoData.change24h?.toFixed(2) ?? '0.00'}%
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-400">No data available</div>
            )}
          </div>
        </div>
      )}
      <div className="flex gap-2">
        {cryptos.map(crypto => (
          <CryptoWidgetIconButton
            key={crypto.name}
            icon={crypto.icon}
            onSelect={() => setSelectedCrypto(selectedCrypto === crypto.name ? null : crypto.name)}
            isSelected={selectedCrypto === crypto.name}
          />
        ))}
      </div>
    </div>
  );
};
