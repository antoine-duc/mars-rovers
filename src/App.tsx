import { useRef, useState } from 'react';
import { checkPosAndDirection, checkSequence, directions, movesByDirection } from './utils';
import './App.css';

type Rover = {
  position: [number, number];
  direction: Direction;
  sequence: string[];
};

type Direction = 'N' | 'E' | 'S' | 'W';

function App() {
  
  let gridDimensions : [number, number]; // first entry is grid width, second one is height

  const [roversInfos, setRoversInfos] = useState<Rover[]>([]);
  const [showError, setShowError] = useState<Boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // récupère l'input et le split par ligne
  const getInputLines = () : string[] => {
    if (inputRef.current) {
      return inputRef.current.value.split('\n').filter(l => !!l.trim()); // on split par ligne et on enlève les lignes vides
    } else {
      throw Error();
    }
  };

  // récupère les dimensions du plateau
  const setGridDimensions = (dimensionsLine: string) => {
    if (!dimensionsLine) throw Error('Aucune information fournie');
    let dimensions = dimensionsLine.trim().split(/\s+/);
    let gridWidth : number = parseInt(dimensions[0]);
    let gridHeight : number = parseInt(dimensions[1]);
    if (!isNaN(gridWidth) && gridWidth > 0 && !isNaN(gridHeight) && gridHeight > 0) { // on a deux integers pour spécifier les dimensions de la grille, si + de 2 on ne prend que les deux premiers
      gridDimensions = [gridWidth, gridHeight];
    } else {  
      throw Error('Les dimensions du plateau ne sont pas valides');
    } 
  };

  // parse toutes les lignes à partir de la 2ème et récupère les coordonnées et séquences de déplacement
  const getRoversInfos = (lines: string[]) : Rover[] => {
    if (lines.length >= 2 && lines.length % 2 === 0) {
      const rovers : Rover[] = [];
      for (let i = 0; i < lines.length; i = i + 2) {
        // start position and direction
        let startInfos = lines[i].toUpperCase().trim().split(/\s+/);
        let startX = parseInt(startInfos[0]);
        let startY = parseInt(startInfos[1]);
        let startDirection = startInfos[2];

        // sequence de déplacement (ligne suivante)
        let sequence = lines[i+1].toUpperCase().replace(/\s+/g, '');

        if (checkPosAndDirection(startX, startY, startDirection, gridDimensions) && checkSequence(sequence)) {
          rovers.push({
            position: [startX, startY],
            direction: startDirection as Direction,
            sequence: sequence.split('')
          });
        } else {
          throw Error('Informations de rover non valides');
        }
      }
      return rovers;
    } else {
      throw Error('Nombre de lignes incorrect');
    }
  };

  // click on button handler
  const tryParseInputAndMoveRovers = () => {
    let lines : string[];
    let rovers : Rover[];
    setRoversInfos([]);
    setShowError(false);
    setErrorMessage('');

    try {
      lines = getInputLines();
      setGridDimensions(lines[0]); // la première ligne représente les dimensions du plateau
      rovers = getRoversInfos(lines.slice(1)); // les lignes suivantes contiennent les infos des différents rovers
      moveRovers(rovers);
    } catch (e: any) {
      setShowError(true);
      setErrorMessage(e.message);
    }
  };

  // loop over rovers and move them
  const moveRovers = (rovers: Rover[]) => {
    rovers.forEach(rover => {
      moveRover(rover);
    });
    setRoversInfos(rovers);
  };

  // séquence de déplacement d'un rover
  const moveRover = (rover: Rover) => {
    rover.sequence.forEach(seq => {
      if (seq === 'L') {
        rover.direction = directions[(directions.indexOf(rover.direction) - 1 + directions.length) % directions.length] as Direction;
      } else if (seq === 'R') {
        rover.direction = directions[(directions.indexOf(rover.direction) + 1) % directions.length] as Direction;
      } else if (seq === 'M') {
        let newX = rover.position[0] + movesByDirection[rover.direction][0];
        let newY =  rover.position[1] + movesByDirection[rover.direction][1];
        if (checkPosAndDirection(newX, newY, rover.direction, gridDimensions)) {
          rover.position = [newX, newY];
        } else {
          throw Error('Le Rover est tombé dans un précipice :(');
        }
      }
    });
  };

  return (
    <div className={'wrapper'}>
      <textarea className={'roversInput ' + (showError ? ' error' : '')} ref={inputRef} placeholder="Enter rovers informations..." />
      <button className={'ctaMoveRovers'} onClick={tryParseInputAndMoveRovers}>GO</button>
      <div className={'outputMessage'}>
        {roversInfos.length && !errorMessage ? roversInfos.map((rover, i) => (
          <div key={i} className={'roverInfo'}>
            <div>{'Rover ' + (i + 1)}</div>
            <div className={'roverResult'}>{rover.position[0] + ' ' + rover.position[1] + ' ' + rover.direction}</div>
          </div>
        ))
        :
          errorMessage && <div className={'errorMessage'}>{errorMessage}</div>
        }
        </div>
    </div>
  );
}

export default App;
