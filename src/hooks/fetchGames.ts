//contains the main functionality of fetching our games
import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";

export interface Platform{//describes the shape of one platform in the parent_platform array, raw.io did a terrible job here..., exporting so PLatformIconList can use
  id: number,
  name: string,
  slug: string,
}

export interface Game {//exporting this interface to use in GameCard to beautify its output
    //the shape of a singular game as defined in rawg.io
    id: number; //identification needed for output as list and uniqueness in server
    name: string; //name of the game
    background_image: string;//the background img info each game contains
    parent_platforms: {platform: Platform}[] //the platforms this game is availble on, an arr obj
    metacritic: number,//the score of each game
  }
  
interface FetchGamesResponse {
    //the shape of the 'response' in the .then callback function
    count: number;
    results: Game[];
  }
  
function fetchGames(){
    const [games, setGames] = useState<Game[]>([]); //initilizes an empty array to hold the game objects that are being fetched from the server
    const [error, setError] = useState(""); //possible errors that may arise from fetching, this is the messaging that would return
    const [isLoading, setLoading] = useState(false);
    
  useEffect(() => {
        const controller = new AbortController();
        setLoading(true);//start showing loading skeletorn when we start fetching the games
      apiClient//where we set up the axios http requests
        .get<FetchGamesResponse>("/games", {signal: controller.signal}) //the <> is used so the get knows the shape of the response data, the signal: is for cancelling ongoing fetch requets
        
        .then((responseData) =>{
           setGames(responseData.data.results);
          setLoading(false);}) //if  fetch is sucessfull, get response data to modify the game object arr, then stop loading
        
        .catch((possibleError) => {//if there's any error, get the error message caught and set it to our empty string
            
          if(possibleError instanceof CanceledError)  return;//checking for canceled req.
            setError(possibleError.message);
            setLoading(false);//stop loading when we encounter an error
        
          }); 
        return () => controller.abort;//cleanup function, prevents memory leaks and removes unwanted behaviours
    }, []);    //empty arr (arr of dependencies) is stop constantly sending requests for out backend  

    return {games, error, isLoading};//returning this and using it gameGrid and gameCard to use this data, as well as making loading
}

export default fetchGames
