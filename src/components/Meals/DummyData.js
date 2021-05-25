import ChickenKebap from '../../assets/chickenKebap.png'
import Pizza from '../../assets/pizza.png'
import RoastedChicken from '../../assets/roastedChicken.png'
import Rice from '../../assets/rice.png'

const DUMMY_MEALS = [
    {
      chickenKebap: {
        name: "Chicken kebap",
        description: "This is chicken kebap",
        img: `${ChickenKebap}`,
        price: 5,
      },
    },
    {
      pizza: {
        name: "Pizza",
        description: "This is pizza",
        img: `${Pizza}`,
        price: 3,
      },
    },
    {
      roastedChicken: {
        name: "Roasted chicken",
        description: "This is Roasted Chicken",
        img: `${RoastedChicken}`,
        price: 4,
      },
    },
    {
      rice: {
        name: "Rice",
        description: "This is rice",
        img: `${Rice}`,
        price: 2,
      },
    },
  ]

  export default DUMMY_MEALS