const express = require('express');
const router = express.Router();
const app              = express();
const path             = require('path');
const fs               = require('fs');
                         require('dotenv').config();
// in order to create the routes for the products you need to load the model



const ensureLoggedInApiVersion = require('../lib/ensure-logged-in-api-version');
const ListModel = require('../models/list-model');
const CardModel = require('../models/card-model');

router.post('/api/lists/:id/cards', ensureLoggedInApiVersion, (req, res, next) => {
    CardModel
        .findOne({ list: req.params.id })
        .sort({ position: -1 })
        .exec((err, lastCard) => {
            if (err) {
                res.status(500).json({ message: 'Find card went to shittttemojii' });
                return;
            }
            let newPosition = 1;
            if (lastCard) {
                newPosition = lastCard.position + 1;
            }
            const theCard = new CardModel({
                title: req.body.cardTitle,
                position: newPosition,
                list: req.params.id


            });
            theCard.save((err) => {
                if (err) {
                    res.status(500).json({ message: 'card did not save' });
                    return;
                }
                ListModel.findByIdAndUpdate(
                    req.params.id,
                    { $push: { cards: theCard._id } },
                    (err, listFromDB) => {
                        if (err) {
                            res.status(500).json({ message: 'it did not work bruh' });
                            return;
                        }

                        res.status(200).json(theCard);
                    }

                );

            });

        }); //close exec()

}); //close the post route '/api/lists'

router.patch('./api/cards/:id', ensureLoggedInApiVersion, (req, res, next) => {
    CardModel.findByIdAndUpdate(
        req.params.id,
        (err, cardFromDB) => {
            if (err) {
                res.status(500).json({ message: 'card update did not work' });
                return;
            }
            // if statements are created to handle blank fields when creating a card
            if (req.body.cardTitle) {
                cardFromDB.title = req.body.cardTitle;
            }

            if (req.body.cardDescription) {
                cardFromDB.description = req.body.cardDescription;
            }

            if (req.body.cardDueDate) {
                cardFromDB.dueDate = req.body.cardDueDate;
            }

            cardFromDB.save((err) => {
                if (err) {
                    res.status(500).json({ message: 'card save did not work' });
                    return;
                }

                res.status(200).json(cardFromDB);
            });

        }
    ); //close findById
}); //close patch '/api/cards/:id'

// ensureLoggedInApiVersion,
router.delete('/api/cards/del/:id',  (req, res, next) => {
    const cardId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      res.status(400).json({ message: "The ID you send the backend was invalid"});
      return;
    }
    console.log(`This is the card the you are trying ot delete ${cardId}`);
    CardModel.remove({ _id: cardId}, (err) => {
            if (err) {
                res.status(500).json({ message: 'card remove did not work' });
                return;
            }

            ListModel.findByIdAndUpdate(
                cardFromDB.list,
                { $pull: { cards: cardsFromDB._id } },
                (err) => {
                    if (err) {
                        res.status(500).json({ message: 'list update went to SHhhhhhh ' });
                        return;
                    }

                    res.json({ message: 'We were able to remove card'});
                    res.status(200).json(cardFromDB);

                }
            );
        }
    );
}); // close delete '/api/cards/:id

module.exports = router;
