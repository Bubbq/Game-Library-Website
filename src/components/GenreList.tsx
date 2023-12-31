//outputting each genre onto the side of the website

import { Button, HStack, Heading, Image, List, ListItem, Spinner } from "@chakra-ui/react";
import fetchGenres, { Genre } from "../hooks/fetchGenres";
import getCroppedImageUrl from "../services/img-url";

interface Props{//used for the callback function to main about the users genre choice
  onSelectedGenre: (genre: Genre) => void//this will be a function that takes in a genre obj and returns void
  selectedGenre: Genre | null //the genre selected that will be bold, the null if none are selected
}

const GenreList = ({selectedGenre, onSelectedGenre}: Props) => {
  const { data, isLoading, error} = fetchGenres();//get the return value 'data' from the hook fetchGenres
  
  if(error) return null//if theres an error, return nothing
  if(isLoading) return <Spinner/>//if loading and no error, display a spinner until all the genres load
  
  return (
  <>
    <Heading fontSize={'2xl'} marginBottom={3}>Genres</Heading>
    <List>
      {data.map((singleGenre) => (//map out every element of the genre array with the img
        <ListItem key={singleGenre.id} paddingY = "5px">
          <HStack>
            <Image
              objectFit={'cover'}//prevent distorting of pics genres bc were cropping them incorrectly
              boxSize="32px"
              borderRadius={8}
              src={getCroppedImageUrl(singleGenre.image_background)}//using the cropped function, taking a string, and live crops the img url fetched from fetchGenre and fetchData
              />
            <Button whiteSpace={'normal'} fontWeight={singleGenre.id == selectedGenre?.id ? 'bold' : 'normal'}  onClick={() =>onSelectedGenre(singleGenre)} variant = 'link' fontSize = "lg">{singleGenre.name}</Button>{/*allows us to press on the genre, the font will change to bold if the id of the genre pressed matches any of the genres listed on the left*/}
          </HStack>
        </ListItem>
      ))}
    </List>
  </>
  );
};

export default GenreList;
