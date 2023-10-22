This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Proof Of Purchase

Welcome to CarChain! We offer a seamless decentralized marketplace platform for buying and selling cars using the power of blockchain.

### Features

- **Token Bound Accounts (TBA):** Each car is represented by a unique ERC6551 token bound account, ensuring the authenticity and traceability of the vehicle.
- **Document Verification:** Any verified document related to the car can be associated as minted ERC721 tokens held under its TBA. This guarantees the transparency and authenticity of every car's history and details.
- **XMTP Messaging:** Our integration with the XMTP blockchain messaging library allows buyers and sellers to communicate directly, ensuring a smooth transaction process.
  Bidding System: Fancy a car? Place a bid and get a chance to own it! Our transparent bidding system ensures fair market competition.
- **AI Integration:** Just snap a picture of your car and let our AI API identify details about it! No more manual hassles.

### How It Works

1. **Listing a Car**

- Capture a photo of your car using your phone.
- Our AI API processes the image and identifies the car's make, model, year, and other specifications.
- Enter any additional details or information about the car.
- Upload and verify essential documents related to the car.
- Once satisfied, mint the car's data as a TBA, and it's now listed on the marketplace.

2. **Buying a Car**

- Browse the listings and select a car of your interest.
- Check out its associated documents, ensuring the car's authenticity and condition.
- Use the XMTP messaging system to communicate with the seller, ask questions, or negotiate prices.
  Place a bid or buy the car directly.

3. **Completing the Transaction**

- Once a deal is reached, the car's ownership (TBA) is transferred to the buyer upon successful transaction.
- All details of the transaction are stored on the blockchain, ensuring transparency and security.

![Alt text](popjpg)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Contact

If you have questions or need further information, please open an issue or contact the maintainers directly.
