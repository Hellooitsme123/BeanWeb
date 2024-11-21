
places = {
    "spawn": {
        "formal": "Empty Room",
        "viewtext": "You wake up in a strange room with nothing but a painting, a desk, and a door.",
        "actions": {
            "desk": {
                "type": "open",
                "formal": "Desk",
                "open":{
                    "success": {
                        "text": "You view the desk, seeing lots of dust on its plain, wooden surface. You open it and find a paper, saying, '97-25-11'.",
                        "result": () => inventory.push("code-paper-1"),
                        
                    },
                    "con": () => true,
                }
            },
            "painting": {
                "type": "move",
                "formal": "Painting",
                "move": {
                    "success": {
                        "text": "You successfully use the crowbar to thrust the painting's frame off of the wall, almost hitting yourself in the process. Behind it you find a blue key.",
                        "result": () => inventory.push("blue_key"),
                    },
                    "failure": {
                        "text": "You try to get the painting off of the wall, but to no avail. Your hands aren't strong enough to move it, so maybe try using a tool.",
                    },
                    "con": () => inventory.includes("crowbar"),
                }
            },
            "door": {
                "type": "open",
                "formal": "Door",
                "open": {
                    "success": {
                        "text": "You open the door and see a hallway with various other doors, including drawers and paintings throughout. Do you want to enter the hallway?",
                        "result": () => eventOptions([["Enter",() => curPlace = places.hallway,"You leave to explore the hallway."],["Stay",() => true,"You stay, not ready to leave yet."]])
                    },
                }
            }
        }
    },
    "hallway": {
        "formal": "Hallway",
        "viewtext": "A rundown hallway including various doors: one with presumably mold growing over it, one with lots of scratches on it, a blue door, which you woke up in, and a strong door with lots of chains around it. Each side of the hallway has two doors, and between those doors are drawers. On the left is a drawer with a bunch of books and a few coins, while the one on the right has nothing on top. At the end of the hallway is a staircase blocked by furniture and mysterious gunk.",
        "actions": {
            "locked_door": {
                "type": "open",
                "formal": "Chained Door",
                "open": {
                    "success": {
                        
                    },
                    "failure": {
                        "text": "The various chains across the door are simply too strong for everything you have as of current. You try to shake them, but they won't budge.",
                    },
                    "con": ()=> inventory.includes("metal_crusher_9000"),
                }
            },
            "blue_door": {
                "type": "open",
                "formal": "Blue Door",
                "open": {
                    "success": {
                        "text": "Do you want to open the blue door?",
                        "result": () => eventOptions([["Enter",() => curPlace = places.spawn,"You go back to the room you woke up in."],["Stay",() => true,"You stay in the hallway."]])
                    },
                }
            },
            "desk": {
                "type": "view",
                "formal": "Dusty Desk",
                "open": {
                    "success": {
                        "text": "You view the dusty desk with coins and books. You take a coin and leave.",
                        "result": () => inventory.push("coin"),
                        
                    }
                }
            }
        }
    },
}
items = {
    "code-paper-1": {
        "formal": "Code Paper 1",
    }
}