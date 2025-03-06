import { addMember, getMembers, getMemberById } from '../models/memberModel.js';

export const addNewMember = (req, res) => {
  const { name, email, phone, address, membershipType } = req.body;
  addMember(name, email, phone, address, membershipType, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding member', error: err });
    }
    res.status(200).json({ message: 'Member added successfully', memberId: result.insertId });
  });
};

export const getAllMembers = (req, res) => {
  getMembers((err, members) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving members', error: err });
    }
    res.status(200).json(members);
  });
};

export const getMember = (req, res) => {
  const { id } = req.params;
  getMemberById(id, (err, member) => {
    if (err || !member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.status(200).json(member);
  });
};
