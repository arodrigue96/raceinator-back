# Raceinator Back

Status: In Progress

## Endpoints

| Method | URL      | Description         |
| ------ | -------- | ------------------- |
| `GET`  | `/teams` | Retrieve all teams. |

### GET Response Example:

```json
{
  "teams": [
    {
      "_id": "674caf6429e6f47f8dc6e67c",
      "name": "Ducati Lenovo Team",
      "ridersNames": ["Marc Marquez", "Francesco Bagnaia"],
      "championshipTitles": 2,
      "imageUrl": "https://exclusivomotos.com/wp-content/uploads/2021/02/Ducati-team-scaled.jpg",
      "altImageText": "The team's motorbikes",
      "description": "The Ducati Lenovo Team is one of MotoGP's most successful teams, representing Italian innovation and speed. With its headquarters in Bologna, Italy, and the powerful Ducati Desmosedici GP23, the team consistently competes at the top level of MotoGP.",
      "debutYear": 2003,
      "isOfficialTeam": true
    },
    {
      "_id": "674caf6429e6f47f8dc6e67d",
      "name": "Red Bull KTM Factory Racing",
      "ridersNames": ["Brad Binder", "Pedro Acosta"],
      "championshipTitles": 0,
      "imageUrl": "https://resources.motogp.pulselive.com/photo-resources/2024/02/12/4fc6e9ed-b9d6-4b24-9e86-0425ddde6640/Binder_Miller_Red-Bull-KTM_MotoGP_24-3-.jpg?width=2880&height=1620",
      "altImageText": "The KTM Factory Racing team's motorbikes",
      "description": "Red Bull KTM Factory Racing represents Austrian engineering and relentless determination in MotoGP. Based in Mattighofen, Austria, and powered by the KTM RC16, the team has made significant progress since its debut in 2017, becoming a consistent contender in the championship. In 2023, they achieved 4th place in the Riders' Championship, 2nd in the Constructors' standings, and 4th in the Teams' rankings. Since 2017, KTM has accumulated seven MotoGP Grand Prix wins and two Sprint victories, achieved with two different riders. For the 2025 season, the team has signed a multi-year contract with Spanish rider Pedro Acosta, a two-time World Champion, to join Brad Binder in the factory lineup.",
      "debutYear": 2017,
      "isOfficialTeam": true
    }
  ]
}
```
