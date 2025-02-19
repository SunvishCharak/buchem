import React, { useState } from "react";
import "../Styles/SizeChart.css";

const LengthChartModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div>
      <button className="size-chart-btn" onClick={openModal}>
        Length Guide
      </button>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}>
              X
            </button>
            <h2 className="section-title">Dress Length Guide</h2>
            <div className="size-chart">
              <table>
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Mini</th>
                    <th>Short</th>
                    <th>Knee Length</th>
                    <th>Below Knee</th>
                    <th>Calf</th>
                    <th>Midi</th>
                    <th>Ankle</th>
                    <th>Long</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>XS</td>
                    <td>31</td>
                    <td>32</td>
                    <td>36</td>
                    <td>39</td>
                    <td>42</td>
                    <td>48</td>
                    <td>50</td>
                    <td>52</td>
                  </tr>
                  <tr>
                    <td>S</td>
                    <td>32</td>
                    <td>33</td>
                    <td>37</td>
                    <td>40</td>
                    <td>44</td>
                    <td>49</td>
                    <td>51</td>
                    <td>53</td>
                  </tr>
                  <tr>
                    <td>M</td>
                    <td>32</td>
                    <td>33</td>
                    <td>37</td>
                    <td>40</td>
                    <td>44</td>
                    <td>49</td>
                    <td>51</td>
                    <td>53</td>
                  </tr>
                  <tr>
                    <td>L</td>
                    <td>34</td>
                    <td>34</td>
                    <td>38</td>
                    <td>41</td>
                    <td>46</td>
                    <td>50</td>
                    <td>52</td>
                    <td>54</td>
                  </tr>
                  <tr>
                    <td>XL</td>
                    <td>34</td>
                    <td>34</td>
                    <td>38</td>
                    <td>41</td>
                    <td>46</td>
                    <td>50</td>
                    <td>52</td>
                    <td>54</td>
                  </tr>
                  <tr>
                    <td>XXL</td>
                    <td>35</td>
                    <td>35</td>
                    <td>39</td>
                    <td>43</td>
                    <td>47</td>
                    <td>51</td>
                    <td>53</td>
                    <td>55</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LengthChartModal;
