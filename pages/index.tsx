import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Box, Button, Heading, Input, useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [wallet, setWallet] = useState("");

  const [openseaUrl, setOpenseaUrl] = useState("");

  const toast = useToast();

  const [untilEnd, setUntilEnd] = useState(0);

  const mint = useCallback(async () => {
    const response = await fetch("/api/mint", {
      method: "POST",
      body: JSON.stringify({
        address: wallet,
      }),
    });

    if (response.status !== 200) {
      try {
        const responseJson = JSON.parse(await response.text());
        const message = responseJson["message"];
        toast({
          status: "error",
          title: message,
        });
      } catch (err) {
        toast({
          status: "error",
          title: "Failed to mint NFT, please try again",
        });
      }

      throw new Error(`Mint failed, status code = ${response.status}`);
    }

    toast({
      status: "success",
      title: "Your NFT has been minted!",
    });

    const result = await response.json();
    setOpenseaUrl(result["openseaUrl"]);
  }, [wallet]);

  const displayTime = useCallback((seconds) => {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
  }, []);

  useEffect(() => {
    const endDate = new Date(1635301825);
    const interval = setInterval(() => {
      const now = new Date();
      setUntilEnd(endDate.getTime() - now.getTime() / 1000);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Farza DOT COM</title>
        <meta name="description" content="Come get this sweet sweet NFT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        position="absolute"
        height={"100vh"}
        width="100vw"
        zIndex={-1}
        display="block"
        backgroundImage="https://nftlabs.mypinata.cloud/ipfs/bafkreigujah2nr7hckyqxvlnllfoxvhopmkawyemb3c2hjg7v2luysh67m"
        backgroundAttachment="scroll"
        backgroundRepeat="repeat-x"
      ></Box>

      <Box className={styles.main} width={"100vw"}>
        <h1 className={styles.title}>
          Welcome to <strong>FARZA DOT COM</strong>
        </h1>

        {openseaUrl === "" ? (
          <Box
            sx={{
              ".wallet-input": {
                backgroundColor: "white",
              },
            }}
            textAlign="center"
          >
            <Heading textAlign={"center"} size="sm" my={4}>
              The drop is over! Hope you got your Farza!
            </Heading>
          </Box>
        ) : (
          <Box backgroundColor="white" p={2}>
            <Heading color={"blue"} size="sm">
              <a href={openseaUrl} target={"_blank"}>
                🎉 🙌 Click here to open your NFT in OpenSea (it will show a 404
                for 10-20 minutes until it gets indexed)
              </a>
            </Heading>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Home;
